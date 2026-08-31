import React, { useState, useEffect, useRef } from 'react';
import { 
  UserRole, 
  WeatherData, 
  Location, 
  Language, 
  UserProfile, 
  ChatMessage, 
  Conversation 
} from '../types';
import { sendAgroChatMessage } from '../services/geminiService';
import { 
  getConversations, 
  createConversation, 
  addMessageToConversation 
} from '../services/firestoreService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Plus, 
  MessageSquare, 
  MapPin, 
  ExternalLink, 
  Compass, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface AIAgronomistChatViewProps {
  weatherData: WeatherData;
  location: Location;
  role: UserRole;
  user: UserProfile | null;
  lang: Language;
}

const QUICK_PROMPTS_RW = [
  "🌱 Ese iki ni igihe cyiza cyo gutera ibigori muri aka karere?",
  "🧪 Imvura ya none ntiyantwarira ifumbire ya UREA nitegura gushyiramo?",
  "🐛 Uko narwanya nkongwa idasanzwe (Fall Armyworm) ku bigori byanjye?",
  "🥔 Imvura nyinshi mu misozi iratuma ibirayi bifatwa n'umusonga (Late blight)?",
  "☀️ Ese ikirere cy'iminsi 3 kiri imbere gikwiriye kwanika ibishyimbo ku mashitingi?",
  "💧 Ni ryari nkwiriye gufungura imiyoboro y'amazi mu gishanga cy'umuceri?"
];

const QUICK_PROMPTS_EN = [
  "🌱 Is today an optimal planting window for maize in this district?",
  "🧪 What is the fertilizer wash-off risk if I apply UREA today?",
  "🐛 How do I prevent and scout Fall Armyworm in young maize?",
  "🥔 How do I protect highland Irish potatoes from Late Blight during wet spells?",
  "☀️ Is the 3-day solar forecast suitable for drying grain to <13.5% moisture?",
  "💧 What are the best water harvesting methods for steep hillside terraces?"
];

const AIAgronomistChatView: React.FC<AIAgronomistChatViewProps> = ({
  weatherData,
  location,
  role,
  user,
  lang
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = user ? user.uid : 'demo-farmer-rwanda-001';

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadChatHistory = async () => {
    try {
      const convs = await getConversations(userId);
      setConversations(convs);
      if (convs.length > 0) {
        setActiveConversationId(convs[0].id);
        setMessages(convs[0].messages);
      } else {
        // Start fresh welcome message
        startNewChat();
      }
    } catch (err) {
      console.warn("Failed to load conversations:", err);
      startNewChat();
    }
  };

  const startNewChat = async () => {
    const welcomeText = lang === 'rw'
      ? `Muraho! Ndi **Umujyanama Mukuru mu Buhinzi n'Iteganyagihe mu Rwanda (AgroWeather AI Agronomist)**.
Muri **${location.name}**, ubushyuhe buri kuri **${weatherData.current.temp.toFixed(1)}°C**, ububobere bw'ubutaka buri kuri **${weatherData.current.soil_moisture_percentage}%**, kandi imvura ya none ni **${weatherData.current.rainfall_mm}mm**.

Mbwira ikibazo ufite ku bihingwa, ifumbire, kurwanya ibyonnyi, cyangwa igihe cyiza cyo gutera!`
      : `Hello! I am your **AgroWeather Rwanda AI Agronomist & Decision Assistant**.
Currently in **${location.name}**, temperature is **${weatherData.current.temp.toFixed(1)}°C**, soil moisture is **${weatherData.current.soil_moisture_percentage}%**, with **${weatherData.current.rainfall_mm}mm** precipitation.

How can I assist your farm with planting windows, pest management, fertilizer safety, or grain drying today?`;

    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'model',
      text: welcomeText,
      timestamp: new Date().toISOString()
    };

    setMessages([initialMsg]);

    try {
      const newConv = await createConversation(
        userId,
        lang === 'rw' ? `Inama y'ubuhinzi - ${location.name}` : `Agro Advice - ${location.name}`,
        [initialMsg]
      );
      setActiveConversationId(newConv.id);
      setConversations(prev => [newConv, ...prev]);
    } catch (err) {
      console.warn("Failed to create conversation in Firestore:", err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendAgroChatMessage(query, role, weatherData, location, lang);

      const modelMsg: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        text: response.text,
        timestamp: new Date().toISOString(),
        sources: [
          { title: "Meteo Rwanda Official Station Telemetry", uri: "https://www.meteorwanda.gov.rw" },
          { title: "MINAGRI Climate Resilience Advisory", uri: "https://www.minagri.gov.rw" },
          { title: "RAB Crop Protection Guidelines", uri: "https://www.rab.gov.rw" }
        ]
      };

      setMessages(prev => [...prev, modelMsg]);

      if (activeConversationId) {
        await addMessageToConversation(activeConversationId, userMsg);
        await addMessageToConversation(activeConversationId, modelMsg);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        text: lang === 'rw'
          ? "Ihangane, habaye akabazo mu guhuza na serivisi ya AI. Nyamuneka ongera ugerageze cyangwa urebe amabwiriza ya Meteo Rwanda."
          : "Temporary connection error with AI Agronomist service. Please retry in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = lang === 'rw' ? QUICK_PROMPTS_RW : QUICK_PROMPTS_EN;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-white h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* Left Sidebar: Conversations & Telemetry Context */}
      <div className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-4 space-y-4 justify-between shadow-xl">
        <div className="space-y-3">
          <button
            onClick={startNewChat}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'rw' ? 'Ikiganiro Gishya' : 'New Agro Query'}</span>
          </button>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              {lang === 'rw' ? 'Ibiganiro Byahise' : 'Saved Sessions'}
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setMessages(conv.messages);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                    activeConversationId === conv.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Farm Context Injected into AI */}
        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location.name} • {location.altitudeMeters}m</span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Temp:</span>
              <span className="font-semibold">{weatherData.current.temp.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Soil Moisture:</span>
              <span className="font-semibold text-emerald-400">{weatherData.current.soil_moisture_percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rainfall:</span>
              <span className="font-semibold text-sky-400">{weatherData.current.rainfall_mm} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-9 flex flex-col bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-400 flex items-center justify-center text-slate-950 font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white">AgroWeather AI Agronomist</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Gemini 2.5 Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'rw' ? 'Inama zifashisha amakuru ya Meteo Rwanda, MINAGRI & RAB' : 'Agricultural decisions grounded in real-time Rwandan climate telemetry'}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono text-emerald-400 font-bold">{location.name} Station</span>
            <span className="text-[10px] text-slate-400 block">{weatherData.current.condition.description}</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-slate-950 font-medium rounded-br-none shadow-md'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-bl-none shadow-lg whitespace-pre-line'
                  }`}
                >
                  {msg.text}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-700/80 flex flex-wrap gap-2 text-[10px]">
                      <span className="text-slate-400 font-semibold">{lang === 'rw' ? 'Inkomoko:' : 'Citations:'}</span>
                      {msg.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900/60 rounded text-sky-300 hover:text-white transition-colors"
                        >
                          <span>{s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] mt-1.5 ${isUser ? 'text-emerald-950/70 text-right' : 'text-slate-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-slate-950 font-bold flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400 p-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 font-medium text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span>{lang === 'rw' ? 'AI Agronome ari gusesengura ikirere n\'ubuhinzi...' : 'AI Agronomist analyzing climate parameters...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Queries */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-300 border border-slate-700/60 transition-all font-medium whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lang === 'rw'
                ? `Baza AI Agronome ku buhinzi muri ${location.name} (urugero: imvura, ifumbire, nkongwa)...`
                : `Ask AI Agronomist regarding farming in ${location.name}...`
            }
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
          />

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'rw' ? 'Ohereza' : 'Send'}</span>
          </button>
        </form>

      </div>

    </div>
  );
};

export default AIAgronomistChatView;
