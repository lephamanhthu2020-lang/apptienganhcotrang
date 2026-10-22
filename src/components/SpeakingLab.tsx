import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  SkipForward,
  Star,
  Keyboard,
  Info,
  Layers,
  Award,
} from 'lucide-react';
import { BuddyAvatar } from './BuddyAvatar';
import { GradeLevel } from '../types';
import { SpeechRecognizer, isSpeechRecognitionSupported, speakEnglish } from '../utils/speech';
import { playCorrectChime, playStarDing, playVictoryFanfare } from '../utils/audioEffects';

interface SpeakingScenario {
  id: string;
  title: string;
  roleplayType: string;
  buddyPrompt: string;
  buddyPromptVi: string;
  targetResponses: string[];
  buddyCheer: string;
}

const SCENARIOS: SpeakingScenario[] = [
  {
    id: 'intro',
    title: '1. Chào hỏi & Làm quen',
    roleplayType: 'Bạn mới làm quen',
    buddyPrompt: 'Hello! What is your name?',
    buddyPromptVi: 'Xin chào! Tên của bạn là gì nào?',
    targetResponses: ['My name is Nam.', 'My name is Lan.', 'Hello Buddy, I am Minh.'],
    buddyCheer: 'Great job! Nice to meet you, my friend! 🌟',
  },
  {
    id: 'age',
    title: '2. Hỏi tuổi bạn bè',
    roleplayType: 'Làm quen sinh nhật',
    buddyPrompt: 'How old are you, little explorer?',
    buddyPromptVi: 'Năm nay con bao nhiêu tuổi rồi?',
    targetResponses: ['I am eight years old.', 'I am seven years old.', 'I am nine years old.'],
    buddyCheer: 'Wow, eight years old is wonderful! 🎂',
  },
  {
    id: 'family',
    title: '3. Giới thiệu gia đình',
    roleplayType: 'Kể về người thân',
    buddyPrompt: 'Who is this in your photo?',
    buddyPromptVi: 'Đây là ai trong bức ảnh của bạn vậy?',
    targetResponses: ['This is my mother.', 'This is my father.', 'This is my lovely sister.'],
    buddyCheer: 'Your family is so lovely and warm! ❤️',
  },
  {
    id: 'food',
    title: '4. Cửa hàng đồ ăn',
    roleplayType: 'Robot là người bán hàng - Học sinh làm khách',
    buddyPrompt: 'Welcome to Buddy Store! What would you like to eat?',
    buddyPromptVi: 'Chào mừng con đến cửa hàng! Con muốn dùng món gì?',
    targetResponses: ['I want an apple, please.', 'I would like some milk and bread.', 'Can I have some chicken?'],
    buddyCheer: 'Here you are! Enjoy your delicious meal! 🍎🥛',
  },
  {
    id: 'hobbies',
    title: '5. Kể về sở thích',
    roleplayType: 'Chia sẻ đam mê',
    buddyPrompt: 'What do you like doing in your free time?',
    buddyPromptVi: 'Con thích làm gì vào thời gian rảnh rỗi?',
    targetResponses: ['I like drawing pictures.', 'I like playing football.', 'I love reading English books.'],
    buddyCheer: 'That is such a cool hobby! Keep it up! 🎨⚽',
  },
  {
    id: 'dreams',
    title: '6. Ước mơ tương lai',
    roleplayType: 'Nhà du hành tương lai',
    buddyPrompt: 'What would you like to be in the future?',
    buddyPromptVi: 'Lớn lên con ước mơ trở thành ai?',
    targetResponses: ['I would like to be a teacher.', 'I want to be an engineer.', 'I want to be a doctor.'],
    buddyCheer: 'Incredible dream! Buddy believes in you! 🚀✨',
  },
  {
    id: 'directions',
    title: '7. Hỏi đường trong thành phố',
    roleplayType: 'Robot làm hướng dẫn viên - Học sinh hỏi địa điểm',
    buddyPrompt: 'Where do you want to go today?',
    buddyPromptVi: 'Hôm nay con muốn đi đâu nào?',
    targetResponses: ['Where is the library, please?', 'I want to go to the park.', 'Where is the school?'],
    buddyCheer: 'Turn left and go straight, it is right there! 🗺️',
  },
];

interface SpeakingLabProps {
  gradeLevel: GradeLevel;
  initialTarget?: string;
  onAddStars: (stars: number) => void;
}

export const SpeakingLab: React.FC<SpeakingLabProps> = ({ gradeLevel, initialTarget, onAddStars }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = SCENARIOS[selectedScenarioIndex];

  const [targetSentence, setTargetSentence] = useState(scenario.targetResponses[0]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualText, setManualText] = useState('');

  const [evaluation, setEvaluation] = useState<{
    score: number;
    stars: number;
    feedback: string;
    tips: string;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    recognizerRef.current = new SpeechRecognizer();
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    setTargetSentence(scenario.targetResponses[0]);
    setTranscript('');
    setEvaluation(null);
    setIsListening(false);
  }, [selectedScenarioIndex]);

  // Play question when scenario changes
  const playBuddyPrompt = () => {
    speakEnglish(scenario.buddyPrompt);
  };

  const handleStartListening = () => {
    if (!recognizerRef.current || !recognizerRef.current.isAvailable()) {
      setIsManualInput(true);
      return;
    }

    if (isListening) {
      recognizerRef.current.stop();
      setIsListening(false);
      return;
    }

    setTranscript('');
    setEvaluation(null);
    setIsListening(true);

    recognizerRef.current.start(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 0) {
          evaluateChildSpeaking(text.trim());
        }
      },
      (error) => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleManualSubmit = () => {
    if (!manualText.trim()) return;
    setTranscript(manualText.trim());
    evaluateChildSpeaking(manualText.trim());
  };

  const evaluateChildSpeaking = async (userSaid: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/evaluate-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: userSaid,
          targetSentence,
          gradeLevel,
        }),
      });

      const data = await res.json();
      setEvaluation(data);

      if (data.score >= 80) {
        playCorrectChime();
        playStarDing();
        onAddStars(data.stars || 2);
      } else {
        playCorrectChime();
      }
    } catch (e) {
      // Fallback evaluation
      const norm1 = userSaid.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const norm2 = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const isMatch = norm1 === norm2;
      const score = isMatch ? 95 : 80;
      setEvaluation({
        score,
        stars: 3,
        feedback: 'Con nói rất tốt và tự tin! Buddy rất vui được nghe giọng con!',
        tips: `Con hãy đọc to từ trọng tâm: "${targetSentence.split(' ')[0]}"`,
      });
      playStarDing();
      onAddStars(2);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng 4: Luyện nói thông minh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            SPEAK WITH BUDDY 🎤
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-1">
            Mạnh dạn nói to cùng người bạn robot AI thân thiện, không sợ nói sai!
          </p>
        </div>

        <button
          onClick={playBuddyPrompt}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-xs font-bold border border-white/30 flex items-center gap-1.5 transition-colors"
        >
          <Volume2 className="w-4 h-4 text-cyan-200" /> Nghe Buddy hỏi
        </button>
      </div>

      {/* Scenario Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenarioIndex(i)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedScenarioIndex === i
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main Speaking Stage with Buddy in Center */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Role badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
          <Layers className="w-3.5 h-3.5" />
          Tình huống: {scenario.roleplayType}
        </div>

        {/* Buddy 3D Avatar */}
        <BuddyAvatar
          size="lg"
          expression={isListening ? 'listening' : evaluation ? 'cheering' : 'talking'}
          showSpeechBubble={true}
          speechText={scenario.buddyPrompt}
        />

        {/* Buddy question in English & Vietnamese */}
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-800">
              "{scenario.buddyPrompt}"
            </h3>
            <button
              onClick={playBuddyPrompt}
              className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-xl"
              title="Phát lại âm thanh"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 italic">({scenario.buddyPromptVi})</p>
        </div>

        {/* Target sentence choices */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Gợi ý câu con có thể nói:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {scenario.targetResponses.map((res, idx) => (
              <button
                key={idx}
                onClick={() => setTargetSentence(res)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  targetSentence === res
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                }`}
              >
                "{res}"
              </button>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="text-xs font-medium text-slate-500">Mục tiêu:</span>
            <span className="text-xs font-black text-rose-600">{targetSentence}</span>
            <button
              onClick={() => speakEnglish(targetSentence)}
              className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-0.5"
            >
              <Volume2 className="w-3.5 h-3.5" /> Nghe mẫu
            </button>
          </div>
        </div>

        {/* Live Audio Transcript Display */}
        {transcript && (
          <div className="w-full bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-center space-y-1 animate-fadeIn">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Buddy nghe thấy con nói:
            </span>
            <p className="font-heading text-lg sm:text-xl font-black text-amber-900">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Big Mic Button */}
        {!isManualInput ? (
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={handleStartListening}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all transform active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200 scale-105'
                  : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white hover:shadow-rose-500/40 hover:scale-105'
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              <span className="text-[10px] font-black uppercase mt-1">
                {isListening ? 'Dừng' : 'Nói'}
              </span>
            </button>
            <p className="text-xs text-slate-500 font-medium">
              {isListening ? 'Buddy đang lắng nghe con... Hãy nói to nhé!' : 'Chạm vào micro và đọc to câu mẫu'}
            </p>
          </div>
        ) : (
          /* Text input fallback */
          <div className="w-full max-w-md space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Nhập câu trả lời của con..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-rose-500"
              />
              <button
                onClick={handleManualSubmit}
                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Gửi
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Chế độ nhập văn bản dự phòng khi thiết bị chưa hỗ trợ microphone.
            </p>
          </div>
        )}

        {/* Switch mode button & skip */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <button
            onClick={() => setIsManualInput(!isManualInput)}
            className="hover:text-rose-600 flex items-center gap-1"
          >
            <Keyboard className="w-4 h-4" />
            {isManualInput ? 'Dùng Micro' : 'Nhập văn bản'}
          </button>
          <span>•</span>
          <button
            onClick={() => {
              const nextIdx = (selectedScenarioIndex + 1) % SCENARIOS.length;
              setSelectedScenarioIndex(nextIdx);
            }}
            className="hover:text-rose-600 flex items-center gap-1"
          >
            <SkipForward className="w-4 h-4" /> Bỏ qua & đổi tình huống
          </button>
        </div>

        {/* Evaluation Card */}
        {evaluation && (
          <div className="w-full bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-left space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-emerald-800 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{evaluation.feedback}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= evaluation.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block text-slate-700">Lời khuyên luyện tập từ Buddy:</span>
              <p>{evaluation.tips}</p>
            </div>

            {/* Buddy Cheer phrase */}
            <p className="text-xs font-bold text-rose-600 italic">Buddy: "{scenario.buddyCheer}"</p>
          </div>
        )}

        {/* Transparency note as requested by prompt */}
        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-left">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Ghi chú sư phạm:</strong> Hệ thống sử dụng công nghệ nhận diện giọng nói Web Speech API và AI trợ giảng. Phản hồi mang tính động viên và hỗ trợ luyện tập phản xạ cho học sinh tiểu học, không thay thế việc kiểm tra ngữ âm trực tiếp của giáo viên.
          </span>
        </div>
      </div>
    </div>
  );
};
