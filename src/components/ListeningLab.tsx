import React, { useState } from 'react';
import {
  Headphones,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Gauge,
  HelpCircle,
  PlusCircle,
  Star,
  ArrowRight,
} from 'lucide-react';
import { GradeLevel } from '../types';
import { speakEnglish } from '../utils/speech';
import { playCorrectChime, playStarDing, playTryAgainSound } from '../utils/audioEffects';

interface ListeningExercise {
  id: string;
  type: 'picture' | 'word' | 'fill' | 'dialogue';
  title: string;
  audioPrompt: string;
  question: string;
  options: { label: string; icon?: string }[];
  correctIndex: number;
  explanation: string;
}

const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'l1',
    type: 'picture',
    title: 'Dạng 1: Nghe và chọn hình đúng',
    audioPrompt: 'I see a big yellow school bus.',
    question: 'Nghe và chọn hình ảnh đồ vật được nhắc đến:',
    options: [
      { label: 'Xe buýt trường học', icon: '🚌' },
      { label: 'Xe cứu hỏa', icon: '🚒' },
      { label: 'Xe cảnh sát', icon: '🚓' },
      { label: 'Xe đạp', icon: '🚲' },
    ],
    correctIndex: 0,
    explanation: '"Yellow school bus" là chiếc xe buýt trường học màu vàng.',
  },
  {
    id: 'l2',
    type: 'word',
    title: 'Dạng 2: Nghe và chọn từ vựng đúng',
    audioPrompt: 'My favourite pet is a lovely rabbit.',
    question: 'Nghe và chọn từ con vật xuất hiện trong câu:',
    options: [
      { label: 'Rabbit', icon: '🐰' },
      { label: 'Tiger', icon: '🐯' },
      { label: 'Monkey', icon: '🐒' },
      { label: 'Panda', icon: '🐼' },
    ],
    correctIndex: 0,
    explanation: 'Từ được phát âm là "rabbit" (con thỏ).',
  },
  {
    id: 'l3',
    type: 'fill',
    title: 'Dạng 3: Nghe và điền từ còn thiếu',
    audioPrompt: 'I would like an apple and a glass of milk, please.',
    question: 'Hoàn thành câu: "I would like an ____ and a glass of milk."',
    options: [
      { label: 'apple', icon: '🍎' },
      { label: 'orange', icon: '🍊' },
      { label: 'banana', icon: '🍌' },
      { label: 'egg', icon: '🥚' },
    ],
    correctIndex: 0,
    explanation: 'Từ còn thiếu trong câu nghe được là "apple".',
  },
  {
    id: 'l4',
    type: 'dialogue',
    title: 'Dạng 4: Nghe đoạn hội thoại ngắn',
    audioPrompt: 'Buddy: Where are you going, Mai? Mai: I am going to the school library to read books.',
    question: 'Bạn Mai đang đi đến đâu?',
    options: [
      { label: 'Thư viện trường (Library)', icon: '📚' },
      { label: 'Sân bóng đá (Playground)', icon: '⚽' },
      { label: 'Phòng y tế (Hospital)', icon: '🏥' },
      { label: 'Nhà ăn (Canteen)', icon: '🥪' },
    ],
    correctIndex: 0,
    explanation: 'Mai nói: "I am going to the school library to read books."',
  },
];

interface ListeningLabProps {
  gradeLevel: GradeLevel;
  onAddStars: (stars: number) => void;
}

export const ListeningLab: React.FC<ListeningLabProps> = ({ gradeLevel, onAddStars }) => {
  const [exercises, setExercises] = useState<ListeningExercise[]>(LISTENING_EXERCISES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speechRate, setSpeechRate] = useState<number>(0.8); // Default slow for kids
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Custom teacher dialogue creator
  const [showTeacherInput, setShowTeacherInput] = useState(false);
  const [newAudioText, setNewAudioText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');

  const currentExercise = exercises[currentIndex];

  const playAudio = () => {
    speakEnglish(currentExercise.audioPrompt, speechRate);
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentExercise.correctIndex;
    if (isCorrect) {
      playCorrectChime();
      playStarDing();
      onAddStars(1);
    } else {
      playTryAgainSound();
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev < exercises.length - 1 ? prev + 1 : 0));
  };

  const handleAddCustomExercise = () => {
    if (!newAudioText.trim() || !newQuestionText.trim() || !newCorrectAnswer.trim()) return;

    const newEx: ListeningExercise = {
      id: `custom_${Date.now()}`,
      type: 'dialogue',
      title: 'Bài tập nghe mới từ giáo viên',
      audioPrompt: newAudioText.trim(),
      question: newQuestionText.trim(),
      options: [
        { label: newCorrectAnswer.trim(), icon: '⭐' },
        { label: 'Phương án B', icon: '🔹' },
        { label: 'Phương án C', icon: '🔹' },
        { label: 'Phương án D', icon: '🔹' },
      ],
      correctIndex: 0,
      explanation: 'Câu trả lời đúng khớp với nội dung bài nghe của giáo viên.',
    };

    setExercises([...exercises, newEx]);
    setShowTeacherInput(false);
    setNewAudioText('');
    setNewQuestionText('');
    setNewCorrectAnswer('');
    setCurrentIndex(exercises.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng 5: Luyện nghe thông minh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            LISTEN & LEARN 🎧
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-1">
            Lắng nghe âm thanh chuẩn bản xứ, chọn hình và câu đúng để nhận sao vàng!
          </p>
        </div>

        {/* Speed switch: Chậm 0.75x hoặc Thông thường 1.0x */}
        <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center gap-1 text-xs font-bold">
          <span className="text-purple-200 px-2 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" /> Tốc độ:
          </span>
          <button
            onClick={() => setSpeechRate(0.75)}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              speechRate <= 0.8 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            Chậm (0.75x) 🐢
          </button>
          <button
            onClick={() => setSpeechRate(1.0)}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              speechRate === 1.0 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            Chuẩn (1.0x) 🐰
          </button>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
        {/* Progress & Type */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
            {currentExercise.title}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Bài {currentIndex + 1} / {exercises.length}
          </span>
        </div>

        {/* Big Audio Play Button */}
        <div className="p-8 bg-gradient-to-b from-violet-50/80 to-purple-50/50 rounded-3xl border border-violet-100 flex flex-col items-center justify-center space-y-3 text-center">
          <button
            onClick={playAudio}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Volume2 className="w-10 h-10 animate-pulse" />
          </button>
          <div>
            <h4 className="font-heading text-lg font-bold text-slate-800">
              Bấm để nghe âm thanh
            </h4>
            <p className="text-xs text-slate-500">
              Con có thể bấm nghe nhiều lần cho đến khi rõ nghĩa nhé
            </p>
          </div>
        </div>

        {/* Question text */}
        <div className="space-y-1">
          <h3 className="font-bold text-base sm:text-lg text-slate-800">
            {currentExercise.question}
          </h3>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentExercise.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentExercise.correctIndex;

            let cardStyle = 'border-slate-200 hover:border-violet-400 hover:bg-violet-50/30 bg-white text-slate-800';
            if (isAnswered) {
              if (isCorrect) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300';
              } else if (isSelected) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-800';
              } else {
                cardStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between gap-3 shadow-xs ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  {opt.icon && <span className="text-2xl">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </div>

                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback explanation */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-xs sm:text-sm text-violet-950 font-medium space-y-1 animate-fadeIn">
            <div className="font-bold flex items-center gap-1.5 text-violet-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Nội dung đoạn nghe:</span>
            </div>
            <p className="font-bold italic text-slate-700">"{currentExercise.audioPrompt}"</p>
            <p className="text-slate-600">{currentExercise.explanation}</p>
          </div>
        )}

        {/* Action Bottom */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setShowTeacherInput(!showTeacherInput)}
            className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" /> Giáo viên thêm đoạn nghe mới
          </button>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <span>Bài tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Teacher Dialogue Input Form */}
        {showTeacherInput && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn text-left">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Thêm bài nghe mới cho học sinh:
            </h4>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Đoạn âm thanh Tiếng Anh:
              </label>
              <input
                type="text"
                value={newAudioText}
                onChange={(e) => setNewAudioText(e.target.value)}
                placeholder="Ví dụ: I have a cute small cat and two birds."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Câu hỏi cho học sinh:
              </label>
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Ví dụ: Bạn nhỏ có bao nhiêu chú chim?"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Đáp án đúng:
              </label>
              <input
                type="text"
                value={newCorrectAnswer}
                onChange={(e) => setNewCorrectAnswer(e.target.value)}
                placeholder="Ví dụ: Two birds (2 chú chim)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowTeacherInput(false)}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold text-slate-600"
              >
                Hủy
              </button>
              <button
                onClick={handleAddCustomExercise}
                className="px-4 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold"
              >
                Tạo bài luyện nghe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
