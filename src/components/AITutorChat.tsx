import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  Volume2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  BookOpen,
  RotateCcw,
  User,
} from 'lucide-react';
import { GradeLevel } from '../types';
import { BuddyAvatar } from './BuddyAvatar';
import { speakEnglish } from '../utils/speech';
import { playStarDing } from '../utils/audioEffects';

interface ChatMessage {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  timestamp: string;
}

interface AITutorChatProps {
  gradeLevel: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onAddStars: (stars: number) => void;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
  gradeLevel,
  onSelectGrade,
  onAddStars,
}) => {
  const [topic, setTopic] = useState('Greetings & Daily Life');
  const [difficulty, setDifficulty] = useState<'Dễ' | 'Vừa' | 'Nâng cao'>('Dễ');
  const [langMode, setLangMode] = useState<'bilingual' | 'english_only'>('bilingual');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'buddy',
      text: `Hello little explorer! 🌟 (Xin chào bạn nhỏ!) I am Buddy, your AI English friend! Are you in Grade ${gradeLevel}? Tell me: what is your favourite animal? (Con thích con vật nào nhất?)`,
      timestamp: 'Vừa xong',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'How do you say "Con mèo" in English?',
    'I like playing football ⚽',
    'What is your favourite colour?',
    'Give me a mini English quiz!',
    'Giải thích từ "Family" cho con',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build short history for server proxy
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/buddy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          gradeLevel,
          topic,
          history,
        }),
      });

      const data = await res.json();
      const buddyReply = data.reply || 'Great job! Keep practicing English with Buddy! 🌟';

      const buddyMsg: ChatMessage = {
        id: `bud_${Date.now()}`,
        sender: 'buddy',
        text: buddyReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, buddyMsg]);
      playStarDing();
      onAddStars(1);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `bud_${Date.now()}`,
        sender: 'buddy',
        text: 'Beep boop! 🤖 Buddy is so proud of you for trying! Let us say: "I love learning English!"',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        sender: 'buddy',
        text: `Beep boop! Buddy is ready for a new chat! 🚀 Con hãy gõ hoặc chọn câu hỏi bên dưới nhé!`,
        timestamp: 'Vừa xong',
      },
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      {/* Banner & Controls */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BuddyAvatar size="sm" expression={isLoading ? 'thinking' : 'happy'} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Chức năng 7: Gia sư AI Buddy
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading mt-0.5">
              Chat Cùng Gia Sư Robot Buddy
            </h2>
            <p className="text-xs text-sky-100">
              Trợ lý thông minh, kiên nhẫn, hỗ trợ giải thích nghĩa từ và đặt câu.
            </p>
          </div>
        </div>

        <button
          onClick={resetConversation}
          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition-colors"
          title="Bắt đầu hội thoại mới"
        >
          <RotateCcw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* Filter / Customization Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Khối:</span>
          {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
            <button
              key={g}
              onClick={() => onSelectGrade(g)}
              className={`w-6 h-6 rounded-lg font-bold ${
                gradeLevel === g ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Chủ đề:</span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-2 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option>Greetings & Daily Life</option>
            <option>Animals & Pets</option>
            <option>School Things</option>
            <option>Family & Friends</option>
            <option>Food & Drinks</option>
            <option>Future Dreams</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-500">Mức độ:</span>
          {(['Dễ', 'Vừa', 'Nâng cao'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                difficulty === lvl ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xl min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'buddy' && (
              <div className="w-9 h-9 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                🤖
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 space-y-1.5 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-white rounded-tr-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                <span className="font-bold">{msg.sender === 'user' ? 'Em' : 'Robot Buddy'}</span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </p>

              {msg.sender === 'buddy' && (
                <button
                  onClick={() => speakEnglish(msg.text)}
                  className="pt-1 text-[11px] text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Nghe Buddy đọc
                </button>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                👧
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-500 text-white flex items-center justify-center">
              🤖
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>Buddy đang suy nghĩ câu trả lời cho con nhé...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold whitespace-nowrap transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Hỏi Buddy bất cứ câu gì bằng Tiếng Anh hoặc Tiếng Việt..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium focus:outline-hidden"
        />
        <button
          disabled={!inputText.trim() || isLoading}
          onClick={() => handleSendMessage()}
          className="p-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl shadow-md transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Buddy là trợ lý AI học tập an toàn cho học sinh 6-11 tuổi. Không thu thập thông tin cá nhân.
      </p>
    </div>
  );
};
