/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { DiagnosticSurvey } from './components/DiagnosticSurvey';
import { LearningJourney } from './components/LearningJourney';
import { FlashcardZone } from './components/FlashcardZone';
import { SpeakingLab } from './components/SpeakingLab';
import { ListeningLab } from './components/ListeningLab';
import { GameZone } from './components/GameZone';
import { AITutorChat } from './components/AITutorChat';
import { CreativeProjects } from './components/CreativeProjects';
import { AchievementsView } from './components/AchievementsView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ResourceHub } from './components/ResourceHub';
import { ParentPortal } from './components/ParentPortal';
import { ProjectShowcase } from './components/ProjectShowcase';
import { BuddyAvatar } from './components/BuddyAvatar';
import { DifferentiatedTier, GradeLevel, UserRole } from './types';
import { Bot, MessageCircle, Star, X } from 'lucide-react';
import { playStarDing } from './utils/audioEffects';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(3);

  // Gamification state
  const [totalStars, setTotalStars] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('english_buddy_stars');
      return saved ? parseInt(saved, 10) : 48;
    }
    return 48;
  });

  const [streakDays, setStreakDays] = useState<number>(5);
  const [initialSurveyScore, setInitialSurveyScore] = useState<number>(75);
  const [studentTier, setStudentTier] = useState<DifferentiatedTier>('core');
  const [speakingTarget, setSpeakingTarget] = useState<string | undefined>(undefined);

  // Quick Buddy Floating Chat Widget
  const [isQuickBuddyOpen, setIsQuickBuddyOpen] = useState(false);
  const [quickBuddyBubble, setQuickBuddyBubble] = useState('Em hãy cố gắng lên nhé! ⭐');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('english_buddy_stars', totalStars.toString());
    }
  }, [totalStars]);

  const handleAddStars = (starsToAdd: number) => {
    setTotalStars((prev) => prev + starsToAdd);
    playStarDing();
  };

  const handleCompleteSurvey = (score: number, tier: DifferentiatedTier) => {
    setInitialSurveyScore(score);
    setStudentTier(tier);
    handleAddStars(5);
  };

  const handleNavigateToSpeaking = (target?: string) => {
    setSpeakingTarget(target);
    setCurrentTab('speak');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userRole={userRole}
        onSelectRole={setUserRole}
        gradeLevel={gradeLevel}
        onSelectGrade={setGradeLevel}
        totalStars={totalStars}
        streakDays={streakDays}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* TAB: Home */}
        {currentTab === 'home' && (
          <HeroHome
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectRole={setUserRole}
            gradeLevel={gradeLevel}
            onSelectGrade={setGradeLevel}
            totalStars={totalStars}
          />
        )}

        {/* TAB: Diagnostic Survey (Chức năng 1) */}
        {currentTab === 'diagnostic' && (
          <DiagnosticSurvey
            gradeLevel={gradeLevel}
            onSelectGrade={setGradeLevel}
            onCompleteSurvey={handleCompleteSurvey}
            onGoToJourney={() => setCurrentTab('journey')}
          />
        )}

        {/* TAB: Learning Journey (Chức năng 2) */}
        {currentTab === 'journey' && (
          <LearningJourney
            onNavigateToSpeaking={handleNavigateToSpeaking}
            onNavigateToListening={() => setCurrentTab('listen')}
            onNavigateToGames={() => setCurrentTab('games')}
            onAddStars={handleAddStars}
          />
        )}

        {/* TAB: Flashcards (Chức năng 3) */}
        {currentTab === 'flashcards' && (
          <FlashcardZone gradeLevel={gradeLevel} onAddStars={handleAddStars} />
        )}

        {/* TAB: Speaking Lab (Chức năng 4) */}
        {currentTab === 'speak' && (
          <SpeakingLab
            gradeLevel={gradeLevel}
            initialTarget={speakingTarget}
            onAddStars={handleAddStars}
          />
        )}

        {/* TAB: Listening Lab (Chức năng 5) */}
        {currentTab === 'listen' && (
          <ListeningLab gradeLevel={gradeLevel} onAddStars={handleAddStars} />
        )}

        {/* TAB: Games (Chức năng 6) */}
        {currentTab === 'games' && (
          <GameZone gradeLevel={gradeLevel} onAddStars={handleAddStars} />
        )}

        {/* TAB: AI Tutor Chat (Chức năng 7) */}
        {currentTab === 'ai-tutor' && (
          <AITutorChat
            gradeLevel={gradeLevel}
            onSelectGrade={setGradeLevel}
            onAddStars={handleAddStars}
          />
        )}

        {/* TAB: Creative Projects (Chức năng 8) */}
        {currentTab === 'creative' && (
          <CreativeProjects onAddStars={handleAddStars} />
        )}

        {/* TAB: Achievements (Thành tích) */}
        {currentTab === 'achievements' && (
          <AchievementsView
            totalStars={totalStars}
            streakDays={streakDays}
            initialSurveyScore={initialSurveyScore}
          />
        )}

        {/* TAB: Teacher Dashboard (Chức năng Giáo viên) */}
        {currentTab === 'teacher-dashboard' && <TeacherDashboard />}

        {/* TAB: Resource Hub (Kho 8 công cụ học liệu) */}
        {currentTab === 'resource-hub' && <ResourceHub />}

        {/* TAB: Parent Portal (Góc Phụ huynh) */}
        {currentTab === 'parent-portal' && <ParentPortal />}

        {/* TAB: Showcase (Giới thiệu sáng kiến dành cho Ban giám khảo) */}
        {currentTab === 'showcase' && (
          <ProjectShowcase
            onBackToHome={() => setCurrentTab('home')}
            onStartDemo={() => setCurrentTab('journey')}
          />
        )}
      </main>

      {/* Floating Quick Buddy Helper Icon */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
        {isQuickBuddyOpen && (
          <div className="mb-2 bg-white rounded-2xl p-4 shadow-2xl border-2 border-sky-300 max-w-xs animate-fadeIn space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-sky-700 flex items-center gap-1">
                🤖 Buddy luôn bên con:
              </span>
              <button
                onClick={() => setIsQuickBuddyOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              “Con làm bài rất cừ khôi! Đừng quên luyện nói to mỗi ngày để tích lũy thêm sao vàng nhé!”
            </p>
            <button
              onClick={() => {
                setIsQuickBuddyOpen(false);
                setCurrentTab('ai-tutor');
              }}
              className="w-full py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Trò chuyện cùng Buddy 💬
            </button>
          </div>
        )}

        <button
          onClick={() => setIsQuickBuddyOpen(!isQuickBuddyOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-xl shadow-sky-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative border-2 border-white"
          title="Bấm để gặp Buddy"
        >
          <Bot className="w-7 h-7 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-900 rounded-full text-[9px] font-black flex items-center justify-center border border-white">
            ★
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-extrabold text-slate-800 text-sm">
              ENGLISH BUDDY AI – AI ĐỒNG HÀNH CÙNG HỌC SINH TIỂU HỌC HỌC TIẾNG ANH
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sáng kiến giáo dục do <strong>Cô Lê Thị Trang</strong> (Trường Tiểu học Khoái Châu 1, Tỉnh Hưng Yên) đề xuất và triển khai.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Chương trình GDPT 2018 | Khẩu hiệu: “Cá nhân hóa – Tương tác – Truyền cảm hứng”
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-3 text-xs font-bold text-sky-600">
            <button onClick={() => setCurrentTab('home')} className="hover:underline">
              Trang chủ
            </button>
            <button onClick={() => setCurrentTab('diagnostic')} className="hover:underline">
              Khảo sát
            </button>
            <button onClick={() => setCurrentTab('journey')} className="hover:underline">
              8 Đảo
            </button>
            <button onClick={() => setCurrentTab('speak')} className="hover:underline">
              Luyện nói
            </button>
            <button onClick={() => setCurrentTab('games')} className="hover:underline">
              Game Zone
            </button>
            <button onClick={() => setCurrentTab('showcase')} className="hover:underline text-indigo-700">
              Giới thiệu sáng kiến
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
