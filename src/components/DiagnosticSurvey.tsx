import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  ArrowRight,
  RotateCcw,
  Star,
  Sparkles,
  Trophy,
  Award,
} from 'lucide-react';
import { DIAGNOSTIC_TESTS } from '../data/curriculumData';
import { DifferentiatedTier, GradeLevel } from '../types';
import { BuddyAvatar } from './BuddyAvatar';
import { playCorrectChime, playStarDing, playTryAgainSound, playVictoryFanfare } from '../utils/audioEffects';
import { speakEnglish } from '../utils/speech';

interface DiagnosticSurveyProps {
  gradeLevel: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onCompleteSurvey: (score: number, tier: DifferentiatedTier) => void;
  onGoToJourney: () => void;
}

export const DiagnosticSurvey: React.FC<DiagnosticSurveyProps> = ({
  gradeLevel,
  onSelectGrade,
  onCompleteSurvey,
  onGoToJourney,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [tier, setTier] = useState<DifferentiatedTier>('core');

  const questions = DIAGNOSTIC_TESTS[gradeLevel] || DIAGNOSTIC_TESTS[3];
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optIndex: number) => {
    if (showAnswerFeedback) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optIndex }));
    setShowAnswerFeedback(true);

    const isCorrect = optIndex === currentQ.correctIndex;
    if (isCorrect) {
      playCorrectChime();
    } else {
      playTryAgainSound();
    }
  };

  const handleNext = () => {
    setShowAnswerFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });
      const finalScore = Math.round((correctCount / questions.length) * 100);
      setScore(finalScore);

      let assignedTier: DifferentiatedTier = 'core';
      if (finalScore < 60) {
        assignedTier = 'support';
      } else if (finalScore >= 85) {
        assignedTier = 'advanced';
      }
      setTier(assignedTier);
      setIsCompleted(true);
      onCompleteSurvey(finalScore, assignedTier);

      // Trigger celebratory fanfare and confetti
      playVictoryFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowAnswerFeedback(false);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-amber-200" />
              Chức năng 1: Khảo sát năng lực đầu vào
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Cùng Buddy Khám Phá Năng Lực Của Em!
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium">
              “Xin chào! Buddy muốn biết con đã học Tiếng Anh đến đâu. Chúng mình cùng khám phá nhé!”
            </p>
          </div>

          <BuddyAvatar size="sm" expression="happy" />
        </div>

        {/* Grade switch */}
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold">Khối lớp khảo sát:</span>
          <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
              <button
                key={g}
                disabled={currentQuestionIndex > 0 && !isCompleted}
                onClick={() => {
                  onSelectGrade(g);
                  handleReset();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  gradeLevel === g
                    ? 'bg-white text-orange-600 shadow-md scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 disabled:opacity-50'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        /* Question Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% hoàn thành</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100 px-2.5 py-1 rounded-lg">
                Câu {currentQuestionIndex + 1}
              </span>
              <button
                onClick={() => speakEnglish(currentQ.question)}
                className="p-1.5 bg-white text-sky-600 hover:bg-sky-100 rounded-xl shadow-xs transition-colors flex items-center gap-1 text-xs font-bold"
                title="Nghe câu hỏi"
              >
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>Đọc</span>
              </button>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 bg-white text-slate-800';
              if (showAnswerFeedback) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                } else {
                  btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showAnswerFeedback}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between gap-3 shadow-sm transform active:scale-98 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {showAnswerFeedback && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {showAnswerFeedback && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          {showAnswerFeedback && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium animate-fadeIn ${
                selectedAnswers[currentQuestionIndex] === currentQ.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {selectedAnswers[currentQuestionIndex] === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Chính xác! Giỏi lắm con! 🎉</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Buddy giải thích cho con nhé:</span>
                  </>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showAnswerFeedback && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Summary Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 text-center">
          <div className="inline-flex p-4 rounded-3xl bg-amber-100 text-amber-600 shadow-inner">
            <Trophy className="w-16 h-16 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              Chúc Mừng Con Đã Hoàn Thành Bài Khảo Sát!
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Kết quả khảo sát đã được hệ thống ghi nhận vào hồ sơ học tập cá nhân.
            </p>
          </div>

          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl border border-sky-100 max-w-sm mx-auto">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Điểm năng lực đầu vào</span>
            <div className="text-5xl font-black text-blue-600 my-2">{score} / 100</div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${s <= Math.round(score / 20) ? 'fill-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Differentiated Placement Card */}
          <div className="p-5 rounded-2xl border text-left space-y-2 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Phân nhóm học tập cá nhân hóa:</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  tier === 'advanced'
                    ? 'bg-purple-100 text-purple-700'
                    : tier === 'core'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {tier === 'advanced'
                  ? '🌟 Khám phá nâng cao (≥ 85%)'
                  : tier === 'core'
                  ? '🚀 Phát triển (60% - 84%)'
                  : '🌱 Củng cố nền tảng (< 60%)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {tier === 'advanced'
                ? 'Con có nền tảng ngữ âm và từ vựng xuất sắc! Buddy sẽ đồng hành cùng con thực hiện các thử thách mở rộng, luyện nói câu dài và dự án sáng tạo.'
                : tier === 'core'
                ? 'Con đã nắm vững các kiến thức cơ bản của khối lớp. Hãy tiếp tục khám phá các hòn đảo ngôn ngữ để tự tin giao tiếp cùng Buddy.'
                : 'Con đừng lo lắng nhé! Buddy sẽ cùng con đi chậm hơn, học kỹ từng từ vựng có tranh ảnh minh họa và nghe phát âm nhiều lần.'}
            </p>
            <p className="text-[11px] text-slate-400 italic">
              * Đây là mức phân nhóm đề xuất từ AI; Giáo viên có quyền điều chỉnh phù hợp với thực tế trên lớp.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToJourney}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-lg shadow-sky-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              BẮT ĐẦU HÀNH TRÌNH KHÁM PHÁ CÁC ĐẢO
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Khảo sát lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
