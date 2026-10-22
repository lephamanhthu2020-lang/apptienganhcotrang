import React, { useState } from 'react';
import {
  Users,
  Star,
  Flame,
  Award,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Sparkles,
  Heart,
  Lightbulb,
} from 'lucide-react';
import { DEMO_STUDENTS } from '../data/teacherDemoData';
import { StudentProfile } from '../types';

export const ParentPortal: React.FC = () => {
  const [selectedStudentCode, setSelectedStudentCode] = useState('KC3A-01');
  const student = DEMO_STUDENTS.find((s) => s.studentCode === selectedStudentCode) || DEMO_STUDENTS[0];

  const homePracticeTips = [
    {
      title: '1. Ôn từ vựng qua đồ vật trong nhà (5 phút)',
      desc: 'Mỗi tối khi dọn bàn ăn hoặc xếp sách vở, bố mẹ có thể hỏi con: "What is this?" để con hào hứng chỉ vào "book", "pencil", "apple", "milk".',
    },
    {
      title: '2. Khen ngợi và khuyến khích nói to cùng Buddy',
      desc: 'Khi con bấm nút micro nói chuyện với robot Buddy, hãy khích lệ con phát âm rõ ràng, to và mỉm cười. Không ngắt lời hoặc chê con phát âm chưa chuẩn.',
    },
    {
      title: '3. Cùng con lật thẻ Flashcard trước giờ đi ngủ',
      desc: 'Dành 3-5 phút xem lại các thẻ từ vựng con gắn cờ "Cần ôn thêm", nghe giọng đọc chuẩn của robot Buddy và đố vui.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng: Cổng Kết Nối Phụ Huynh & Gia Đình
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            GÓC PHỤ HUYNH – ĐỒNG HÀNH CÙNG CON ❤️
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-1">
            Theo dõi tiến trình học tập, huy hiệu và nhận gợi ý giúp con tự tin nói Tiếng Anh tại nhà.
          </p>
        </div>

        {/* Student Selector by Code */}
        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 space-y-1">
          <label className="text-[10px] font-bold text-pink-100 block">Xem hồ sơ của con:</label>
          <select
            value={selectedStudentCode}
            onChange={(e) => setSelectedStudentCode(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold focus:outline-hidden"
          >
            {DEMO_STUDENTS.map((st) => (
              <option key={st.studentCode} value={st.studentCode}>
                {st.name} ({st.studentCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Child Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-3xl flex items-center justify-center shadow-inner">
              {student.avatarSeed}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl font-black text-slate-800">{student.name}</h3>
                <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {student.className}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mã học sinh: <strong className="text-slate-700">{student.studentCode}</strong> | Trường TH Khoái Châu 1
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-center p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 block">Sao tích lũy</span>
              <span className="text-xl font-black text-amber-900 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {student.stars}
              </span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-orange-50 border border-orange-200">
              <span className="text-[10px] font-bold text-orange-700 block">Chuỗi ngày</span>
              <span className="text-xl font-black text-orange-900 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400 text-orange-400" /> {student.streakDays}
              </span>
            </div>
          </div>
        </div>

        {/* Current status & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              1. Năng lực học tập hiện tại:
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 font-medium">Nhóm phân hóa:</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                {student.currentTier === 'advanced'
                  ? '🌟 Khám phá nâng cao'
                  : student.currentTier === 'core'
                  ? '🚀 Phát triển (Chuẩn)'
                  : '🌱 Củng cố nền tảng'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 font-medium">Điểm bài khảo sát đầu vào:</span>
              <span className="text-xs font-bold text-sky-600">{student.initialSurveyScore} / 100 điểm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 font-medium">Số hòn đảo đã vượt qua:</span>
              <span className="text-xs font-bold text-emerald-600">{student.completedStages.length} / 8 Đảo</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              2. Từ vựng con đã làm chủ ({student.vocabularyMastered.length} từ):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {student.vocabularyMastered.map((w, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold shadow-2xs"
                >
                  ✓ {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Teacher Feedback Note for Parents */}
        <div className="p-5 bg-sky-50 border border-sky-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-sky-900 text-xs">
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span>Lời nhắn gửi của Cô Lê Thị Trang (GV Tiếng Anh):</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            “Bé {student.nickname} dạo này tiến bộ rất rõ rệt khi luyện phát âm cùng robot Buddy! Bé không còn rụt rè như đầu năm mà đã chủ động giơ tay phát biểu trên lớp. Gia đình hãy tiếp tục duy trì 10 phút luyện tập vui vẻ mỗi tối cùng con nhé!”
          </p>
        </div>

        {/* Home Practice Tips */}
        <div className="space-y-3 pt-2">
          <h4 className="font-heading text-base font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Gợi Ý Hoạt Động Cùng Con Tại Nhà (Dành Cho Bố Mẹ)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {homePracticeTips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h5 className="font-bold text-xs text-slate-800">{tip.title}</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
