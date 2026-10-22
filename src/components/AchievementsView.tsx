import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Star,
  Flame,
  CheckCircle2,
  Sparkles,
  Heart,
  Smile,
  ShieldCheck,
  BarChart2,
} from 'lucide-react';
import { StudentBadge } from '../types';
import { playStarDing } from '../utils/audioEffects';

interface AchievementsViewProps {
  totalStars: number;
  streakDays: number;
  initialSurveyScore?: number;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  totalStars,
  streakDays,
  initialSurveyScore = 75,
}) => {
  const allBadges: StudentBadge[] = [
    { id: 'b1', title: 'Nhà thám hiểm mới', description: 'Hoàn thành bài khảo sát năng lực đầu vào', icon: '🌟', unlockedAt: '2026-10-15' },
    { id: 'b2', title: 'Ngôi sao nghe hiểu', description: 'Đạt điểm tối đa bài luyện nghe thông minh', icon: '🎧', unlockedAt: '2026-10-18' },
    { id: 'b3', title: 'Mạnh dạn luyện nói', description: 'Thực hành nói 5 câu hoàn chỉnh cùng Buddy', icon: '🎤', unlockedAt: '2026-10-19' },
    { id: 'b4', title: 'Bậc thầy từ vựng', description: 'Thuộc trên 20 từ vựng xuất sắc trên Flashcard', icon: '🏆', unlockedAt: '2026-10-21' },
    { id: 'b5', title: 'Chăm chỉ liên tục', description: 'Giữ chuỗi học tập liên tục không ngắt quãng', icon: '🔥', unlockedAt: '2026-10-22' },
    { id: 'b6', title: 'Họa sĩ song ngữ', description: 'Hoàn thành và nộp dự án poster sáng tạo', icon: '🎨', unlockedAt: '2026-10-20' },
    { id: 'b7', title: 'Chiến binh Game Zone', description: 'Đạt trên 50 điểm trong English Game Zone', icon: '🎮' },
    { id: 'b8', title: 'Chinh phục 8 Đảo', description: 'Mở khóa toàn bộ 8 hòn đảo ngôn ngữ', icon: '🏝️' },
  ];

  // Self perception survey state (Thang đo 1 - 5)
  const [surveyRatings, setSurveyRatings] = useState({
    confidence: 5,
    enjoyment: 5,
    initiative: 4,
    aiHelpfulness: 5,
  });
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const handleRate = (key: keyof typeof surveyRatings, val: number) => {
    playStarDing();
    setSurveyRatings((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng: Thành tích & Tủ Cúp Vinh Danh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            BẢNG THÀNH TÍCH CỦA EM 🏆
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            Ghi nhận từng bước tiến bộ, nỗ lực kiên trì và niềm vui học tập mỗi ngày.
          </p>
        </div>

        {/* Big Trophy counters */}
        <div className="flex gap-3 text-center">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <span className="text-xs text-amber-200 block font-bold">Tổng sao tích lũy</span>
            <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-300" /> {totalStars}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <span className="text-xs text-orange-200 block font-bold">Chuỗi chuyên cần</span>
            <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-orange-400 text-orange-400" /> {streakDays} ngày
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Kho Huy Hiệu Danh Dự Của Em
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {allBadges.filter((b) => b.unlockedAt).length} / {allBadges.length} đã mở khóa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allBadges.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-300 shadow-sm hover:shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="space-y-2">
                  <div className="text-4xl text-center select-none">{badge.icon}</div>
                  <h4 className="font-heading text-sm font-bold text-slate-800 text-center">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 text-center leading-tight">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-center">
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Đạt ngày {badge.unlockedAt}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                      Chưa mở khóa
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Perception Survey (Section VI.4) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            Phiếu Khảo Sát Cảm Nhận Học Tập (Thang đo 1 - 5)
          </span>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-800">
            Con Cảm Thấy Học Cùng Buddy Thế Nào?
          </h3>
          <p className="text-xs text-slate-500">
            Đánh giá cảm nhận giúp cô giáo hiểu tâm lý và cảm xúc của con khi học Tiếng Anh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1: Confidence */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              1. Sự tự tin khi nói Tiếng Anh:
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate('confidence', star)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    star <= surveyRatings.confidence
                      ? 'bg-amber-400 text-slate-900 shadow-xs'
                      : 'bg-white border text-slate-400'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              (1 sao: Vẫn còn e ngại – 5 sao: Rất mạnh dạn tự tin nói)
            </p>
          </div>

          {/* Question 2: Enjoyment */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              2. Mức độ hứng thú tham gia giờ học:
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate('enjoyment', star)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    star <= surveyRatings.enjoyment
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white border text-slate-400'
                  }`}
                >
                  ❤️ {star}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              (1 sao: Chưa thích lắm – 5 sao: Cực kỳ hào hứng mong chờ)
            </p>
          </div>

          {/* Question 3: Initiative */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              3. Sự chủ động tự giác tự học ở nhà:
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate('initiative', star)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    star <= surveyRatings.initiative
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-white border text-slate-400'
                  }`}
                >
                  🌱 {star}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              (1 sao: Cần nhắc nhở – 5 sao: Tự giác mở máy học mỗi ngày)
            </p>
          </div>

          {/* Question 4: AI Helpfulness */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              4. Cảm nhận về sự hữu ích của robot Buddy:
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate('aiHelpfulness', star)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    star <= surveyRatings.aiHelpfulness
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-white border text-slate-400'
                  }`}
                >
                  🤖 {star}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              (1 sao: Ít giúp ích – 5 sao: Buddy là bạn đồng hành tuyệt vời)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400 italic">
            * Kết quả tự đánh giá được phân tách rõ ràng với kết quả kiểm tra năng lực.
          </p>
          <button
            onClick={() => setSurveySubmitted(true)}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-sm"
          >
            {surveySubmitted ? '✓ Đã lưu cảm nhận' : 'Gửi cảm nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};
