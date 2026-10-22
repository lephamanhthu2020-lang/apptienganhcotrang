import React from 'react';
import {
  Sparkles,
  BookOpen,
  Headphones,
  Mic,
  Gamepad2,
  Bot,
  Palette,
  Award,
  GraduationCap,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Heart,
  TrendingUp,
  Layers,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { BuddyAvatar } from './BuddyAvatar';
import { GradeLevel, UserRole } from '../types';
import { playStarDing } from '../utils/audioEffects';

interface HeroHomeProps {
  onNavigate: (tab: string) => void;
  onSelectRole: (role: UserRole) => void;
  gradeLevel: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  totalStars: number;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onNavigate,
  onSelectRole,
  gradeLevel,
  onSelectGrade,
  totalStars,
}) => {
  const handleStartLearning = () => {
    playStarDing();
    onNavigate('diagnostic');
  };

  const featureCards = [
    {
      id: 'diagnostic',
      title: 'Khảo sát năng lực',
      desc: '10 câu hỏi sinh động xác định lộ trình học riêng cho con',
      icon: Compass,
      color: 'from-amber-400 to-orange-500',
      tag: 'Bước 1',
    },
    {
      id: 'journey',
      title: 'Hành trình các Đảo',
      desc: 'Bản đồ 8 hòn đảo diệu kỳ với từ vựng, mẫu câu và thử thách',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-400',
      tag: 'Lộ trình',
    },
    {
      id: 'speak',
      title: 'Luyện nói cùng Buddy',
      desc: 'Micro thông minh nhận diện giọng nói, động viên con nói to rõ',
      icon: Mic,
      color: 'from-rose-500 to-pink-500',
      tag: 'Nổi bật AI',
    },
    {
      id: 'listen',
      title: 'Luyện nghe thông minh',
      desc: 'Chỉnh tốc độ chậm/nhanh, chọn hình ảnh và bắt nhịp âm thanh',
      icon: Headphones,
      color: 'from-violet-500 to-purple-500',
      tag: 'Nghe hiểu',
    },
    {
      id: 'games',
      title: 'Kho 6 Trò chơi',
      desc: 'Word Match, Picture Quiz, Vòng quay ma thuật, Ghép câu...',
      icon: Gamepad2,
      color: 'from-emerald-500 to-teal-400',
      tag: 'Chơi mà học',
    },
    {
      id: 'ai-tutor',
      title: 'Gia sư Robot Buddy',
      desc: 'Hỏi đáp kiên nhẫn, giải thích từ ngữ dễ hiểu cho lứa tuổi 6-11',
      icon: Bot,
      color: 'from-sky-500 to-blue-600',
      tag: 'AI 24/7',
    },
    {
      id: 'creative',
      title: 'Dự án sáng tạo',
      desc: 'Tự làm poster Tiếng Anh, thu âm thuyết trình và gửi cô giáo',
      icon: Palette,
      color: 'from-fuchsia-500 to-pink-500',
      tag: 'Sáng tạo',
    },
    {
      id: 'achievements',
      title: 'Thành tích & Huy hiệu',
      desc: 'Thu thập sao vàng, mở khóa cúp vinh danh và xem sự tiến bộ',
      icon: Award,
      color: 'from-amber-500 to-yellow-400',
      tag: 'Động lực',
    },
  ];

  const coreValues = [
    {
      title: '1. CÁ NHÂN HÓA',
      desc: 'Phân nhóm 3 mức độ (Củng cố - Phát triển - Nâng cao) theo năng lực thực tế.',
      icon: Compass,
      color: 'text-amber-600 bg-amber-100',
    },
    {
      title: '2. TƯƠNG TÁC',
      desc: 'Luyện nghe, nói phản xạ hai chiều với robot Buddy, tương tác đa giác quan.',
      icon: Mic,
      color: 'text-sky-600 bg-sky-100',
    },
    {
      title: '3. SÁNG TẠO',
      desc: 'Giáo viên thiết kế học liệu AI trong 30 giây, học sinh làm poster thuyết trình.',
      icon: Palette,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: '4. THEO DÕI TIẾN BỘ',
      desc: 'Biểu đồ trước & sau, thống kê trực quan số sao, từ vựng và bài tập đã hoàn thành.',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      title: '5. MỞ RỘNG LINH HOẠT',
      desc: 'Dễ dàng áp dụng cho các lớp 1-5 và kết nối thư viện 8 công cụ giảng dạy.',
      icon: Layers,
      color: 'text-rose-600 bg-rose-100',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-sky-400/30">
        {/* Playful background floating circles & clouds */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
        <div className="absolute top-6 left-12 text-3xl opacity-30 select-none pointer-events-none animate-pulse">☁️</div>
        <div className="absolute top-20 right-28 text-2xl opacity-40 select-none pointer-events-none animate-bounce">🌈</div>
        <div className="absolute bottom-10 right-16 text-3xl opacity-30 select-none pointer-events-none">🎈</div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30 text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Sáng Kiến Giáo Dục AI Tiêu Biểu
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold border border-cyan-300/30">
                Tiểu học Khoái Châu 1 – Cô Lê Thị Trang
              </span>
            </div>

            {/* Title & Slogan */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
                WELCOME TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
                  ENGLISH BUDDY AI!
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-sky-100 font-semibold">
                Khám phá thế giới Tiếng Anh cùng người bạn AI thông minh.
              </p>
            </div>

            {/* Slogan & Vision Quote */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-left">
              <p className="text-xs sm:text-sm text-amber-200 font-extrabold uppercase tracking-wide">
                Khẩu hiệu: “Cá nhân hóa – Tương tác – Truyền cảm hứng”
              </p>
              <p className="text-xs sm:text-sm text-white/90 italic mt-1 font-medium leading-relaxed">
                “Mỗi học sinh là một nhà thám hiểm ngôn ngữ – AI giúp mọi học sinh đều mạnh dạn nói, tự tin học và tiến bộ mỗi ngày.”
              </p>
            </div>

            {/* Grade Selector on Hero */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-bold text-white/90">Em đang học:</span>
              {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  onClick={() => onSelectGrade(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    gradeLevel === g
                      ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>

            {/* 3 Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleStartLearning}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-900" />
                BẮT ĐẦU HỌC NGAY
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectRole('teacher');
                  onNavigate('teacher-dashboard');
                }}
                className="px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/30 transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-5 h-5 text-cyan-300" />
                GÓC GIÁO VIÊN
              </button>

              <button
                onClick={() => {
                  onSelectRole('parent');
                  onNavigate('parent-portal');
                }}
                className="px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/30 transition-all flex items-center gap-2"
              >
                <Users className="w-5 h-5 text-pink-300" />
                GÓC PHỤ HUYNH
              </button>
            </div>

            {/* Quick Demo & Judge buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-white/80">
              <span className="font-medium">Chế độ trải nghiệm nhanh:</span>
              <button
                onClick={() => onNavigate('journey')}
                className="underline hover:text-amber-300 font-bold"
              >
                Trải nghiệm Demo Lớp 3
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate('showcase')}
                className="underline hover:text-amber-300 font-bold"
              >
                Dành cho Ban giám khảo
              </button>
            </div>
          </div>

          {/* Right 3D Buddy Character + Interactive Greeting */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative p-6 sm:p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center">
              {/* Interactive Buddy Robot */}
              <BuddyAvatar
                size="xl"
                expression="happy"
                showSpeechBubble={true}
                speechText="Hello little explorer! 🌟 Chào bạn nhỏ!"
              />

              <div className="mt-4 text-center">
                <h3 className="font-heading text-xl font-bold text-white flex items-center justify-center gap-1.5">
                  ROBOT AI BUDDY
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <p className="text-xs text-sky-200 mt-1">
                  Đồng hành luyện nghe, luyện nói và giải đáp Tiếng Anh 24/7
                </p>

                {/* Quick Interactive button to chat with Buddy */}
                <button
                  onClick={() => onNavigate('ai-tutor')}
                  className="mt-3 px-4 py-2 bg-white text-blue-700 hover:bg-cyan-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Bot className="w-4 h-4 text-sky-500" />
                  Nói chuyện cùng Buddy ngay!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher and Project Profile Bar */}
      <section className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-base">Cô Lê Thị Trang</span>
              <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Giáo viên Tiếng Anh
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Trường Tiểu học Khoái Châu 1 – Tỉnh Hưng Yên | Chương trình GDPT 2018
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-500">Đối tượng ứng dụng:</span>
            <p className="text-xs font-bold text-slate-800">Học sinh Tiểu học Lớp 1, 2, 3, 4, 5</p>
          </div>
          <button
            onClick={() => onNavigate('showcase')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors"
          >
            Xem sáng kiến giáo dục
          </button>
        </div>
      </section>

      {/* 5 Core Values Section */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Nền tảng giáo dục thông minh
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            5 Giá Trị Cốt Lõi Của English Buddy AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            Thiết kế riêng cho tâm lý lứa tuổi tiểu học, tạo môi trường học tập an toàn, tự tin và hào hứng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${val.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{val.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Feature Modules Exploration Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Khám phá không gian học tập
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Các Khu Vực Học Tập Của Em
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Bấm vào từng khu vực để bắt đầu nhiệm vụ thám hiểm cùng Buddy!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigate(feat.id)}
                className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all transform hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Accent top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feat.color}`} />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md shadow-sky-500/10 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {feat.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Child-Friendly Security Note */}
      <section className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 text-xs text-sky-800 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-sky-600 shrink-0" />
        <div>
          <span className="font-bold">Môi trường học tập an toàn cho trẻ em (6-11 tuổi):</span>{' '}
          Không yêu cầu email hoặc số điện thoại riêng của trẻ, bảo mật dữ liệu âm thanh cá nhân, nội dung AI được kiểm duyệt nghiêm ngặt theo chuẩn giáo dục tiểu học.
        </div>
      </section>
    </div>
  );
};
