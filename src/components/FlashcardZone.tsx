import React, { useState } from 'react';
import {
  Volume2,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Star,
  BookmarkCheck,
  RefreshCw,
  Search,
} from 'lucide-react';
import { GradeLevel, VocabularyItem } from '../types';
import { LANGUAGE_ISLANDS } from '../data/curriculumData';
import { speakEnglish } from '../utils/speech';
import { playCorrectChime, playStarDing } from '../utils/audioEffects';

interface FlashcardZoneProps {
  gradeLevel: GradeLevel;
  onAddStars: (stars: number) => void;
}

export const FlashcardZone: React.FC<FlashcardZoneProps> = ({ gradeLevel, onAddStars }) => {
  // Aggregate vocabulary from islands
  const allVocab: VocabularyItem[] = LANGUAGE_ISLANDS.flatMap((stage) => stage.vocabularies);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [rememberedIds, setRememberedIds] = useState<string[]>(['v1', 'v2', 'v6']);
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>(['v3']);

  const activeVocabList = allVocab.filter((item) => {
    if (filter === 'remembered') return rememberedIds.includes(item.id);
    if (filter === 'review') return needsReviewIds.includes(item.id);
    return true;
  });

  const currentItem = activeVocabList[currentIndex] || allVocab[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < activeVocabList.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeVocabList.length - 1));
  };

  const markRemembered = () => {
    playStarDing();
    if (!rememberedIds.includes(currentItem.id)) {
      setRememberedIds([...rememberedIds, currentItem.id]);
      setNeedsReviewIds(needsReviewIds.filter((id) => id !== currentItem.id));
      onAddStars(1);
    }
    handleNext();
  };

  const markNeedReview = () => {
    if (!needsReviewIds.includes(currentItem.id)) {
      setNeedsReviewIds([...needsReviewIds, currentItem.id]);
      setRememberedIds(rememberedIds.filter((id) => id !== currentItem.id));
    }
    handleNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng 3: Kho Flashcard AI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            Học Từ Vựng Bằng Flashcard Thông Minh
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Chạm vào thẻ để lật xem nghĩa Tiếng Việt và câu ví dụ sinh động!
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-2 text-center text-xs font-bold">
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl">
            <span className="text-emerald-200">Đã thuộc</span>
            <div className="text-lg text-white font-black">{rememberedIds.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl">
            <span className="text-amber-200">Cần ôn</span>
            <div className="text-lg text-white font-black">{needsReviewIds.length}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex gap-1">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả ({allVocab.length})
          </button>
          <button
            onClick={() => {
              setFilter('remembered');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'remembered' ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Đã nhớ ({rememberedIds.length})
          </button>
          <button
            onClick={() => {
              setFilter('review');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'review' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Cần ôn lại ({needsReviewIds.length})
          </button>
        </div>

        <span className="text-xs font-bold text-slate-400 pr-2">
          {currentIndex + 1} / {activeVocabList.length}
        </span>
      </div>

      {/* Interactive 3D Flip Card */}
      {currentItem ? (
        <div className="perspective-1000 min-h-[340px]">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`cursor-pointer w-full min-h-[340px] rounded-3xl p-8 transition-all duration-500 transform shadow-xl flex flex-col justify-between text-center relative border-2 ${
              isFlipped
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
                : 'bg-gradient-to-br from-white to-sky-50/50 border-sky-200 hover:border-sky-400'
            }`}
          >
            {/* Top info */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Chạm để lật thẻ 🔄</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playStarDing();
                  speakEnglish(currentItem.word);
                }}
                className="p-2 rounded-xl bg-sky-100 text-sky-700 hover:bg-sky-200 flex items-center gap-1 font-bold shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe phát âm</span>
              </button>
            </div>

            {/* Front & Back Content */}
            {!isFlipped ? (
              <div className="space-y-4 my-auto py-6">
                <div className="text-6xl sm:text-7xl select-none animate-bounce">{currentItem.imageUrl || '🌟'}</div>
                <div className="space-y-1">
                  <h3 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-wide">
                    {currentItem.word}
                  </h3>
                  <p className="text-sky-600 font-bold text-base">{currentItem.phonetic}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 my-auto py-6 animate-fadeIn">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                  Nghĩa Tiếng Việt
                </span>
                <h3 className="font-heading text-3xl font-black text-slate-900">
                  {currentItem.meaning}
                </h3>
                <div className="bg-white/80 border border-amber-200 rounded-2xl p-4 max-w-md mx-auto">
                  <span className="text-xs text-slate-400 font-bold block mb-1">Ví dụ thực tế:</span>
                  <p className="font-bold text-slate-800 text-base sm:text-lg">"{currentItem.example}"</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakEnglish(currentItem.example);
                    }}
                    className="mt-2 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Nghe cả câu
                  </button>
                </div>
              </div>
            )}

            {/* Bottom prompt */}
            <div className="text-xs text-slate-400 font-medium">
              {isFlipped ? 'Chạm để quay lại mặt trước' : 'Mẹo: Lắng nghe và đọc to theo giọng mẫu'}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500">
          Chưa có từ nào trong mục này. Hãy chọn "Tất cả" để ôn luyện nhé!
        </div>
      )}

      {/* Navigation & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Từ trước
        </button>

        <div className="flex gap-2">
          <button
            onClick={markNeedReview}
            className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Cần ôn thêm
          </button>
          <button
            onClick={markRemembered}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <BookmarkCheck className="w-4 h-4" /> Đã nhớ (+1 ⭐)
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          Từ tiếp <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
