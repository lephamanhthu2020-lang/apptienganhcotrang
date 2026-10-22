import React, { useState } from 'react';
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
  FolderKanban,
  Volume2,
  VolumeX,
  Compass,
  Users,
  Info,
  Menu,
  X,
  Star,
  Flame,
} from 'lucide-react';
import { GradeLevel, UserRole } from '../types';
import { isSoundEnabled, setSoundEnabled } from '../utils/audioEffects';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  gradeLevel: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  totalStars: number;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onSelectRole,
  gradeLevel,
  onSelectGrade,
  totalStars,
  streakDays,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Sparkles },
    { id: 'diagnostic', label: 'Khảo sát năng lực', icon: Compass },
    { id: 'journey', label: 'Hành trình học tập', icon: BookOpen },
    { id: 'listen', label: 'Luyện nghe', icon: Headphones },
    { id: 'speak', label: 'Luyện nói AI', icon: Mic },
    { id: 'games', label: 'Trò chơi Tiếng Anh', icon: Gamepad2 },
    { id: 'ai-tutor', label: 'Gia sư Buddy', icon: Bot },
    { id: 'creative', label: 'Dự án sáng tạo', icon: Palette },
    { id: 'achievements', label: 'Thành tích', icon: Award },
    { id: 'teacher-dashboard', label: 'Góc giáo viên', icon: GraduationCap },
    { id: 'resource-hub', label: 'Kho học liệu', icon: FolderKanban },
    { id: 'parent-portal', label: 'Góc phụ huynh', icon: Users },
    { id: 'showcase', label: 'Giới thiệu sáng kiến', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
      {/* Top bar with Roles & Quick Badges */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Teacher & School Info */}
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold">GDPT 2018</span>
            <span className="hidden sm:inline">GV: Cô Lê Thị Trang – Trường TH Khoái Châu 1</span>
          </div>

          {/* Quick Badges & Role switcher */}
          <div className="flex items-center gap-3">
            {/* Stars & Streak */}
            <div className="flex items-center gap-2 bg-black/20 px-2.5 py-0.5 rounded-full font-bold">
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {totalStars}
              </span>
              <span className="text-white/40">|</span>
              <span className="flex items-center gap-1 text-orange-300">
                <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                {streakDays} ngày
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-300" /> : <VolumeX className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            {/* Role Pills */}
            <div className="flex items-center bg-white/20 rounded-lg p-0.5 text-[11px] font-bold">
              <button
                onClick={() => {
                  onSelectRole('student');
                  if (currentTab === 'teacher-dashboard' || currentTab === 'parent-portal' || currentTab === 'showcase') {
                    onSelectTab('home');
                  }
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  userRole === 'student' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Học sinh
              </button>
              <button
                onClick={() => {
                  onSelectRole('teacher');
                  onSelectTab('teacher-dashboard');
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  userRole === 'teacher' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Giáo viên
              </button>
              <button
                onClick={() => {
                  onSelectRole('parent');
                  onSelectTab('parent-portal');
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  userRole === 'parent' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Phụ huynh
              </button>
              <button
                onClick={() => {
                  onSelectRole('judge');
                  onSelectTab('showcase');
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  userRole === 'judge' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-amber-200 hover:text-white'
                }`}
              >
                Giám khảo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight group-hover:text-sky-600 transition-colors">
                ENGLISH BUDDY <span className="text-sky-500">AI</span>
              </span>
              <span className="bg-amber-100 text-amber-700 font-bold text-[10px] px-1.5 py-0.5 rounded-full border border-amber-300">
                KIDS 6-11
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Cá nhân hóa – Tương tác – Truyền cảm hứng
            </p>
          </div>
        </div>

        {/* Grade Selector (Quick change for primary student) */}
        <div className="hidden lg:flex items-center gap-1 bg-sky-50/80 p-1 rounded-xl border border-sky-100">
          <span className="text-xs font-bold text-sky-800 px-2">Khối:</span>
          {([1, 2, 3, 4, 5] as GradeLevel[]).map((grade) => (
            <button
              key={grade}
              onClick={() => onSelectGrade(grade)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                gradeLevel === grade
                  ? 'bg-sky-500 text-white shadow-sm scale-105'
                  : 'text-slate-600 hover:bg-sky-100'
              }`}
            >
              Lớp {grade}
            </button>
          ))}
        </div>

        {/* Quick Action Buttons for Judges & Demo */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onSelectTab('diagnostic')}
            className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            Khảo sát năng lực
          </button>
          <button
            onClick={() => onSelectTab('showcase')}
            className="px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            Giới thiệu sáng kiến
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs on Desktop/Tablet */}
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-100 hidden md:block overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-sky-600'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-xl">
          {/* Grade selection mobile */}
          <div className="flex items-center justify-between bg-sky-50 p-2 rounded-xl">
            <span className="text-xs font-bold text-sky-800">Chọn khối lớp:</span>
            <div className="flex gap-1">
              {([1, 2, 3, 4, 5] as GradeLevel[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => onSelectGrade(grade)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold ${
                    gradeLevel === grade ? 'bg-sky-500 text-white' : 'bg-white text-slate-700 border'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
