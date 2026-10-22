import React, { useState } from 'react';
import {
  MapPin,
  Lock,
  CheckCircle,
  Star,
  Play,
  Volume2,
  BookOpen,
  Headphones,
  Mic,
  Gamepad2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Award,
} from 'lucide-react';
import { LANGUAGE_ISLANDS } from '../data/curriculumData';
import { IslandStage, VocabularyItem } from '../types';
import { BuddyAvatar } from './BuddyAvatar';
import { speakEnglish } from '../utils/speech';
import { playCorrectChime, playStarDing, playVictoryFanfare } from '../utils/audioEffects';

interface LearningJourneyProps {
  onNavigateToSpeaking: (targetSentence?: string) => void;
  onNavigateToListening: () => void;
  onNavigateToGames: () => void;
  onAddStars: (stars: number) => void;
}

export const LearningJourney: React.FC<LearningJourneyProps> = ({
  onNavigateToSpeaking,
  onNavigateToListening,
  onNavigateToGames,
  onAddStars,
}) => {
  const [stages, setStages] = useState<IslandStage[]>(LANGUAGE_ISLANDS);
  const [activeStage, setActiveStage] = useState<IslandStage | null>(null);
  const [activeTab, setActiveTab] = useState<'vocab' | 'dialogue' | 'quiz'>('vocab');

  // Mini quiz state inside active stage
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const openStageModal = (stage: IslandStage) => {
    setActiveStage(stage);
    setActiveTab('vocab');
    setQuizIndex(0);
    setSelectedQuizAnswer(null);
    setQuizFinished(false);
    setQuizScore(0);
  };

  const closeStageModal = () => {
    setActiveStage(null);
  };

  const handleQuizAnswer = (optIdx: number) => {
    if (selectedQuizAnswer !== null || !activeStage) return;
    setSelectedQuizAnswer(optIdx);

    const isCorrect = optIdx === activeStage.questions[quizIndex].correctIndex;
    if (isCorrect) {
      playCorrectChime();
      setQuizScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (quizIndex < activeStage.questions.length - 1) {
        setQuizIndex((prev) => prev + 1);
        setSelectedQuizAnswer(null);
      } else {
        setQuizFinished(true);
        playVictoryFanfare();
        onAddStars(3);

        // Update local stage state
        setStages((prev) =>
          prev.map((s) => (s.id === activeStage.id ? { ...s, completed: true, starsEarned: 3 } : s))
        );
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Journey Map Header */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cyan-200">
            <Sparkles className="w-3.5 h-3.5" />
            Chức năng 2: Bản đồ 8 Hòn Đảo Ngôn Ngữ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            Hành Trình Khám Phá Của Em
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            Vượt qua các thử thách từ vựng, hội thoại và trò chơi để mở khóa toàn bộ các hòn đảo kỳ diệu!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <BuddyAvatar size="sm" expression="cheering" />
          <div className="text-left">
            <span className="text-xs text-sky-200 font-bold">Tiến độ chinh phục</span>
            <div className="text-lg font-black text-amber-300 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-300" />
              {stages.filter((s) => s.completed).length} / {stages.length} Đảo Hoàn Thành
            </div>
          </div>
        </div>
      </div>

      {/* Islands Grid / Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages.map((stage, index) => {
          const isCurrentOrUnlocked = stage.unlocked;
          return (
            <div
              key={stage.id}
              onClick={() => isCurrentOrUnlocked && openStageModal(stage)}
              className={`relative rounded-3xl p-5 border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isCurrentOrUnlocked
                  ? 'bg-white border-sky-100 hover:border-sky-400 hover:shadow-xl cursor-pointer transform hover:-translate-y-1'
                  : 'bg-slate-100 border-slate-200 opacity-75 cursor-not-allowed'
              }`}
            >
              {/* Top Banner Gradient */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${stage.colorTheme}`} />

              <div className="space-y-4">
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Chặng {index + 1}
                  </span>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= stage.starsEarned ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Island Icon & Name */}
                <div className="space-y-1">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stage.colorTheme} text-white flex items-center justify-center text-xl font-bold shadow-md shadow-sky-500/10`}
                  >
                    🏝️
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 leading-snug">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{stage.subtitle}</p>
                </div>

                {/* Content quick overview */}
                <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Từ vựng:</span>
                    <span className="font-bold text-slate-800">{stage.vocabularies.length} từ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hội thoại mẫu:</span>
                    <span className="font-bold text-slate-800">{stage.dialogue.length} lượt</span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {stage.completed ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Đã hoàn thành
                  </span>
                ) : isCurrentOrUnlocked ? (
                  <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 fill-sky-600" /> Bắt đầu học
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Chưa mở khóa
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">5-10 phút</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Detail Interactive Modal */}
      {activeStage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${activeStage.colorTheme} text-white flex items-center justify-between rounded-t-3xl`}>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  Nhiệm vụ Đảo
                </span>
                <h3 className="text-xl sm:text-2xl font-black">{activeStage.title}</h3>
                <p className="text-xs sm:text-sm text-white/90">{activeStage.subtitle}</p>
              </div>

              <button
                onClick={closeStageModal}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 bg-slate-50">
              <button
                onClick={() => setActiveTab('vocab')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'vocab'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                1. Từ vựng ({activeStage.vocabularies.length})
              </button>

              <button
                onClick={() => setActiveTab('dialogue')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'dialogue'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mic className="w-4 h-4" />
                2. Hội thoại với Buddy
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                3. Thử thách 3 Sao
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 space-y-4">
              {/* TAB 1: VOCABULARY */}
              {activeTab === 'vocab' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Bấm vào biểu tượng loa để nghe Buddy phát âm mẫu và lặp lại theo nhé:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeStage.vocabularies.map((v) => (
                      <div
                        key={v.id}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all flex items-center justify-between gap-3 bg-white shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{v.imageUrl || '📖'}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 text-base">{v.word}</span>
                              <span className="text-xs text-sky-600 font-medium">{v.phonetic}</span>
                            </div>
                            <p className="text-xs text-slate-500">{v.meaning}</p>
                            <p className="text-[11px] text-slate-400 italic mt-0.5">"{v.example}"</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playStarDing();
                            speakEnglish(v.word);
                          }}
                          className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => onNavigateToSpeaking(activeStage.vocabularies[0]?.example)}
                      className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      Luyện nói các câu này
                    </button>
                    <button
                      onClick={() => setActiveTab('dialogue')}
                      className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1"
                    >
                      Tiếp: Hội thoại <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: DIALOGUE */}
              {activeTab === 'dialogue' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Cùng đóng vai giao tiếp với bạn Buddy nào:
                  </p>
                  <div className="space-y-3">
                    {activeStage.dialogue.map((turn, i) => (
                      <div
                        key={turn.id || i}
                        className={`p-3.5 rounded-2xl flex items-start gap-3 ${
                          turn.speaker === 'Buddy'
                            ? 'bg-sky-50 border border-sky-100 text-sky-950'
                            : 'bg-amber-50 border border-amber-100 text-amber-950 ml-6'
                        }`}
                      >
                        <span className="text-xl">{turn.speaker === 'Buddy' ? '🤖' : '👧'}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              {turn.speaker}
                            </span>
                            <button
                              onClick={() => speakEnglish(turn.english)}
                              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> Nghe
                            </button>
                          </div>
                          <p className="font-bold text-sm sm:text-base mt-0.5">{turn.english}</p>
                          <p className="text-xs text-slate-500 italic mt-0.5">{turn.vietnamese}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => setActiveTab('vocab')}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Xem lại từ vựng
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1"
                    >
                      Làm bài thử thách <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: QUIZ */}
              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  {!quizFinished ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>
                          Câu hỏi {quizIndex + 1} / {activeStage.questions.length}
                        </span>
                        <span className="text-amber-600 font-bold">Thử thách nhận 3 sao vàng ⭐</span>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <h4 className="font-bold text-base text-slate-800">
                          {activeStage.questions[quizIndex]?.question}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeStage.questions[quizIndex]?.options.map((opt, optIdx) => {
                          const isSelected = selectedQuizAnswer === optIdx;
                          const isCorrect = optIdx === activeStage.questions[quizIndex].correctIndex;

                          let btnClass = 'border-slate-200 bg-white text-slate-800 hover:border-sky-300';
                          if (selectedQuizAnswer !== null) {
                            if (isCorrect) {
                              btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                            } else if (isSelected) {
                              btnClass = 'border-rose-400 bg-rose-50 text-rose-800';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={selectedQuizAnswer !== null}
                              onClick={() => handleQuizAnswer(optIdx)}
                              className={`p-3.5 rounded-2xl border-2 font-bold text-sm text-left transition-all ${btnClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <div className="text-4xl">🎉</div>
                      <h4 className="font-heading text-xl font-bold text-slate-800">
                        Tuyệt Vời! Con Đã Chinh Phục Được Hòn Đảo Này!
                      </h4>
                      <p className="text-xs text-slate-500">
                        Buddy tặng con 3 Ngôi sao vinh danh vào kho thành tích!
                      </p>
                      <button
                        onClick={closeStageModal}
                        className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs"
                      >
                        Tiếp tục hành trình
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
