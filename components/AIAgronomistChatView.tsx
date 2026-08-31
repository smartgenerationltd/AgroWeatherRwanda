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
  RWANDA_CROPS_DATABASE, 
  LATEST_RWANDA_AGRI_NEWS, 
  RWANDA_INSTITUTIONS 
} from '../services/rwandaAgriKnowledge';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Plus, 
  MessageSquare, 
  MapPin, 
  ExternalLink, 
  HelpCircle,
  PhoneCall,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Newspaper,
  BookOpen,
  Sprout,
  ShieldAlert
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
  "💧 Ni ryari nkwiriye gufungura imiyoboro y'amazi mu gishanga cy'umuceri?",
  "📲 Ni gute nishyura imbuto n'ifumbire muri Smart Nkunganire (*774#)?",
  "🛡️ Ni ayahe mabwiriza y'ubwishingizi bw'ibihingwa bya NAIS (Tekana Urishingiwe)?"
];

const QUICK_PROMPTS_EN = [
  "🌱 Is today an optimal planting window for maize in this district?",
  "🧪 What is the fertilizer wash-off risk if I apply UREA today?",
  "🐛 How do I prevent and scout Fall Armyworm in young maize?",
  "🥔 How do I protect highland Irish potatoes from Late Blight during wet spells?",
  "☀️ Is the 3-day solar forecast suitable for drying grain to <13.5% moisture?",
  "💧 What are the best water harvesting methods for steep hillside terraces?",
  "📲 How do I redeem subsidized seeds on Smart Nkunganire (*774#)?",
  "🛡️ What are the coverage guidelines for NAIS crop insurance?"
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
  
  // Crop Context & Image Upload state
  const [selectedCropId, setSelectedCropId] = useState<string>('all');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge' | 'news'>('chat');

  const fileInputRef = useRef<HTMLInputElement>(null);
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
        startNewChat();
      }
    } catch (err) {
      console.warn("Failed to load conversations:", err);
      startNewChat();
    }
  };

  const startNewChat = async () => {
    const welcomeText = lang === 'rw'
      ? `Muraho! Ndi **Umujyanama Mukuru w'Igihugu mu Buhinzi, Amatungo n'Iteganyagihe mu Rwanda (AgroWeather AI Agronomist)**.
Muri **${location.name}** (Intara ya ${location.provinceRw}, Uburebure: ${location.altitudeMeters}m), ubushyuhe buri kuri **${weatherData.current.temp.toFixed(1)}°C**, ububobere bw'ubutaka buri kuri **${weatherData.current.soil_moisture_percentage}%**, kandi imvura ya none ni **${weatherData.current.rainfall_mm}mm**.

Mfite amakuru yose ya **MINAGRI**, **RAB**, na **Meteo Rwanda** ku bihingwa byose byo mu Rwanda (Ibigori, Ibirayi, Ibishyimbo, Umuceri, Ikawa, n'ibindi), gahunda ya **Smart Nkunganire (*774#)**, ifumbire (DAP, UREA, NPK), no gupima indwara ku mafoto y'ibimera!

Mbwira ikibazo ufite cyangwa uhitemo igihingwa hejuru:`
      : `Hello! I am your **National AgroWeather AI Agronomist & Decision Engine for Rwanda**.
Grounded in **${location.name}** (${location.provinceEn}, Alt: ${location.altitudeMeters}m), current temperature is **${weatherData.current.temp.toFixed(1)}°C**, soil moisture is **${weatherData.current.soil_moisture_percentage}%**, with **${weatherData.current.rainfall_mm}mm** rain today.

I am connected with official agronomic databases from **MINAGRI**, **RAB**, and **Meteo Rwanda** for all Rwandan crops, **Smart Nkunganire (*774#)** subsidy programs, certified seed varieties, and plant disease visual diagnostics.

How can I assist your farming decisions today?`;

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if ((!query.trim() && !imagePreview) || loading) return;

    const cropObj = RWANDA_CROPS_DATABASE.find(c => c.id === selectedCropId);
    const cropContext = cropObj ? `${cropObj.nameRw} (${cropObj.nameEn})` : undefined;

    const userMsgText = query || (lang === 'rw' ? 'Nyamuneka sesengura iyi foto y\'ikimera cyarwaye umbwire indwara n\'umuti ukoreshwa.' : 'Please analyze this diseased crop leaf photo and provide diagnosis and RAB treatment.');

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: userMsgText,
      timestamp: new Date().toISOString()
    };

    const currentImage = imagePreview;
    const currentMime = imageMimeType;

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    try {
      const response = await sendAgroChatMessage(
        userMsgText,
        role,
        weatherData,
        location,
        lang,
        cropContext,
        currentImage || undefined,
        currentMime
      );

      const modelMsg: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        text: response.text,
        timestamp: new Date().toISOString(),
        sources: response.sources || [
          { title: "RAB Crop Protection Guidelines", uri: "https://www.rab.gov.rw" },
          { title: "MINAGRI Climate Resilience Advisory", uri: "https://www.minagri.gov.rw" },
          { title: "Meteo Rwanda Official Station Telemetry", uri: "https://www.meteorwanda.gov.rw" }
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
          ? "Ihangane, habaye akabazo mu guhuza na serivisi ya AI. Nyamuneka ongera ugerageze cyangwa uhamagare helpline ya RAB 4455."
          : "Temporary connection error with AI Agronomist service. Please retry or call RAB toll-free 4455.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = lang === 'rw' ? QUICK_PROMPTS_RW : QUICK_PROMPTS_EN;
  const currentCrop = RWANDA_CROPS_DATABASE.find(c => c.id === selectedCropId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-white h-[calc(100vh-140px)] min-h-[650px]">
      
      {/* Left Sidebar: Conversations, Rwandan Institutional Hub & Telemetry */}
      <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-4 space-y-4 justify-between shadow-xl overflow-hidden">
        <div className="space-y-3 overflow-y-auto pr-1 flex-1 no-scrollbar">
          
          {/* View Mode Toggle */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'chat' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>{lang === 'rw' ? 'Ikiganiro' : 'Chat'}</span>
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'knowledge' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>{lang === 'rw' ? 'Ibihingwa' : 'Crops'}</span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'news' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3 h-3" />
              <span>{lang === 'rw' ? 'Amatangazo' : 'News'}</span>
            </button>
          </div>

          {activeTab === 'chat' && (
            <>
              <button
                onClick={startNewChat}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'rw' ? 'Ikiganiro Gishya' : 'New Agro Query'}</span>
              </button>

              {/* Institutional Direct Hotlines */}
              <div className="p-3 bg-gradient-to-br from-emerald-950/40 via-slate-800/80 to-slate-900/90 rounded-2xl border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" />
                    {lang === 'rw' ? 'Inomero z\'Ubufasha bwa Leta' : 'Rwandan Agri Hotlines'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Toll-Free
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-[10px]">RAB Helpline</div>
                    <div className="font-mono font-extrabold text-emerald-300 text-xs">4455</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-[10px]">MINAGRI Support</div>
                    <div className="font-mono font-extrabold text-emerald-300 text-xs">1221</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-[10px]">Smart Nkunganire</div>
                    <div className="font-mono font-extrabold text-amber-300 text-xs">*774#</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-[10px]">Meteo Weather</div>
                    <div className="font-mono font-extrabold text-sky-300 text-xs">4322</div>
                  </div>
                </div>
              </div>

              {/* Chat Session List */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                  {lang === 'rw' ? 'Ibiganiro Byahise' : 'Saved Sessions'}
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
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
            </>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-1 block">
                {lang === 'rw' ? 'Ububiko bw\'Ibihingwa byo mu Rwanda' : 'Rwandan Crops Library'}
              </span>
              <div className="space-y-2">
                {RWANDA_CROPS_DATABASE.map(crop => (
                  <div 
                    key={crop.id}
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      setActiveTab('chat');
                      handleSendMessage(
                        lang === 'rw' 
                          ? `Mbwira amakuru arambuye ku buhinzi bwa ${crop.nameRw} muri ${location.name} (imbuto za RAB, ifumbire, no kurwanya indwara).` 
                          : `Provide full RAB agronomic package for ${crop.nameEn} in ${location.name}.`
                      );
                    }}
                    className="p-2.5 bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700/60 hover:border-emerald-500/40 rounded-xl cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{crop.nameRw}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">{crop.nameEn}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {lang === 'rw' ? crop.descriptionRw : crop.descriptionEn}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {crop.varieties.slice(0, 3).map((v, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-1 block flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {lang === 'rw' ? 'Amatangazo ya MINAGRI & RAB' : 'MINAGRI & RAB Bulletins'}
              </span>
              <div className="space-y-2">
                {LATEST_RWANDA_AGRI_NEWS.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendMessage(
                        lang === 'rw'
                          ? `Mbwira byinshi ku itangazo rya ${item.sourceAgency}: "${item.titleRw}"`
                          : `Explain more about the advisory from ${item.sourceAgency}: "${item.titleEn}"`
                      );
                    }}
                    className="p-2.5 bg-slate-800/80 hover:bg-slate-700/70 border border-slate-700/60 rounded-xl cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[9px]">
                        {item.sourceAgency}
                      </span>
                      <span className="text-[9px] text-slate-500">{item.publishedDate}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-200">
                      {lang === 'rw' ? item.titleRw : item.titleEn}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {lang === 'rw' ? item.summaryRw : item.summaryEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Live Farm Context Injected into AI */}
        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-2 text-xs mt-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location.name}</span>
            </div>
            <span className="text-slate-400 text-[10px]">{location.altitudeMeters}m altitude</span>
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
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Chat Header with Crop Selector */}
        <div className="p-3.5 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white">AgroWeather AI Agronomist</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  MINAGRI & RAB Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'rw' ? 'Umujyanama w\'Igihugu mu Buhinzi, Amatungo n\'Iteganyagihe' : 'National AI Agronomic Advisor for Rwandan Agriculture & Climate'}
              </p>
            </div>
          </div>

          {/* Quick Crop Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCropId('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCropId === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌾 {lang === 'rw' ? 'Ibihingwa Byose' : 'All Crops'}
            </button>
            {RWANDA_CROPS_DATABASE.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCropId(c.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedCropId === c.id
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c.nameRw}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Crop Banner Info if any */}
        {currentCrop && (
          <div className="px-4 py-2 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">{currentCrop.nameRw} ({currentCrop.nameEn}):</span>
              <span className="text-slate-300 hidden sm:inline">{currentCrop.plantingPeriodRw}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-300 font-mono">DAP: {currentCrop.fertilizerDapKgHa} kg/ha | UREA: {currentCrop.fertilizerUreaKgHa} kg/ha</span>
            </div>
          </div>
        )}

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
                      <span className="text-slate-400 font-semibold">{lang === 'rw' ? 'Inkomoko y\'Amakuru:' : 'Institutional Citations:'}</span>
                      {msg.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900/80 rounded-md text-sky-300 hover:text-white border border-slate-700 transition-colors"
                        >
                          <span>{s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] mt-1.5 ${isUser ? 'text-emerald-950/70 text-right font-medium' : 'text-slate-500'}`}>
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
                <span>{lang === 'rw' ? 'AI Agronome ari gusesengura amakuru ya MINAGRI, RAB na Meteo Rwanda...' : 'AI Agronomist analyzing Rwandan institutional guidelines & climate...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Image Diagnostic Preview if attached */}
        {imagePreview && (
          <div className="px-4 py-2 bg-slate-800/90 border-t border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={imagePreview} alt="Crop Diagnostic" className="w-12 h-12 object-cover rounded-xl border border-emerald-500/50" />
              <div>
                <span className="text-xs font-bold text-white block">{lang === 'rw' ? 'Ifoto y\'ikimera yatoranyijwe' : 'Crop diagnostic image selected'}</span>
                <span className="text-[10px] text-slate-400">{lang === 'rw' ? 'AI iri buyisesengure kureba indwara cyangwa ibyonnyi' : 'Gemini will scan for disease and pests'}</span>
              </div>
            </div>
            <button
              onClick={removeSelectedImage}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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

        {/* Chat Input Bar with Image Upload & Send */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 sm:gap-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title={lang === 'rw' ? 'Ohereza ifoto y\'ikibabi cyarwaye' : 'Upload photo of diseased plant leaf'}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 rounded-xl transition-all flex items-center justify-center flex-shrink-0"
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lang === 'rw'
                ? `Baza AI Agronome ku buhinzi muri ${location.name} (urugero: imbuto, ifumbire ya Nkunganire, indwara)...`
                : `Ask AI Agronomist on Rwandan farming practices in ${location.name}...`
            }
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
          />

          <button
            type="submit"
            disabled={loading || (!inputText.trim() && !imagePreview)}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
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

