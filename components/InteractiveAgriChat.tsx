import React, { useState } from 'react';
import { UserRole, WeatherData, Location, Language } from '../types';
import { QUICK_FARMER_QUESTIONS } from '../constants';
import { askAgroAdvisorCustom } from '../services/geminiService';
import { MessageSquarePlus, Send, Sparkles, Bot, User, HelpCircle, Loader2 } from 'lucide-react';

interface InteractiveAgriChatProps {
  userRole: UserRole;
  weatherData: WeatherData;
  location: Location;
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const InteractiveAgriChat: React.FC<InteractiveAgriChatProps> = ({
  userRole,
  weatherData,
  location,
  lang,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: lang === 'rw'
        ? `Muraho! Ndi "Umwunganizi wa AI mu Buhinzi n'Iteganyagihe" mu karere ka ${location.name}. Mbaza ikibazo icyo ari cyo cyose ku gihe cyo gutera imbuto, gushyira ifumbire, kurinda indwara z'ibihingwa, cyangwa kwanika umusaruro.`
        : `Hello! I am your AI Climate-Smart Agriculture Advisor for ${location.name}. Ask me any question regarding planting dates, fertilizer application windows, pest protection, or post-harvest drying.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const botResponseText = await askAgroAdvisorCustom(
        textToSend,
        userRole,
        weatherData,
        location,
        lang
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-sky-100 p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
              <span>{lang === 'rw' ? 'Umwunganizi wa AI mu Buhinzi' : 'AI Farm Advisory Assistant'}</span>
              <span className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Gemini 3.7
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'rw' ? `Inama zihariye ku butaka n'iteganyagihe bya ${location.name}` : `Localized advice for ${location.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'rw' ? 'Ibibazo by\'ingenzi uhitamo mu kanda rimwe:' : 'Popular Farmer Questions (1-Tap):'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_FARMER_QUESTIONS.map(q => (
            <button
              key={q.id}
              onClick={() => handleSendMessage(lang === 'rw' ? q.queryRw : q.labelEn)}
              disabled={isLoading}
              className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-slate-700 font-medium px-3 py-1.5 rounded-full border border-slate-200 transition-all text-left"
            >
              {lang === 'rw' ? q.labelRw : q.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Message History */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 max-h-80 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>{lang === 'rw' ? 'Umwunganizi wa AI arimo gusesengura amakuru ya Meteo Rwanda...' : 'AI is analyzing agrometeorological conditions...'}</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            lang === 'rw'
              ? `Baza ikibazo ku buhinzi n'iteganyagihe muri ${location.name}...`
              : `Ask about farming & weather in ${location.name}...`
          }
          className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default InteractiveAgriChat;
