import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Palette,
  Sparkles,
  Send,
  Save,
  Volume2,
  CheckCircle,
  Clock,
  Star,
  Plus,
  Trash2,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { CreativeProject } from '../types';
import { DEMO_CREATIVE_PROJECTS } from '../data/teacherDemoData';
import { speakEnglish } from '../utils/speech';
import { playCorrectChime, playStarDing } from '../utils/audioEffects';

interface CreativeProjectsProps {
  onAddStars: (stars: number) => void;
}

export const CreativeProjects: React.FC<CreativeProjectsProps> = ({ onAddStars }) => {
  const [projects, setProjects] = useState<CreativeProject[]>(DEMO_CREATIVE_PROJECTS);
  const [isCreating, setIsCreating] = useState(false);

  // New Project Form State
  const [topic, setTopic] = useState('My Family');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedStickers, setSelectedStickers] = useState<string[]>(['👨‍👩‍👦', '❤️']);
  const [bgColor, setBgColor] = useState('from-sky-100 to-blue-200');

  const availableStickers = [
    '👨‍👩‍👦', '❤️', '🏡', '🌸', '🚀', '🌌', '⭐', '🤖', '🐱', '🐶', '🥛', '🍎',
    '🏫', '✏️', '📖', '⚽', '🎨', '🌱', '🌍', '✨',
  ];

  const topics = [
    'My Family',
    'My School',
    'My Dream',
    'My Favourite Animal',
    'My Green Planet',
  ];

  const colorPalettes = [
    { label: 'Bầu trời xanh', val: 'from-sky-100 to-blue-200' },
    { label: 'Hoa hồng ngọt ngào', val: 'from-pink-100 to-rose-200' },
    { label: 'Nắng ấm vàng', val: 'from-amber-100 to-yellow-200' },
    { label: 'Rừng xanh mát', val: 'from-emerald-100 to-teal-200' },
    { label: 'Vũ trụ tím diệu kỳ', val: 'from-purple-100 to-indigo-200' },
  ];

  const toggleSticker = (s: string) => {
    if (selectedStickers.includes(s)) {
      setSelectedStickers(selectedStickers.filter((item) => item !== s));
    } else {
      if (selectedStickers.length < 6) {
        setSelectedStickers([...selectedStickers, s]);
      }
    }
  };

  const handleSaveOrSubmit = (status: 'draft' | 'submitted') => {
    if (!title.trim() || !caption.trim()) {
      alert('Con hãy nhập Tiêu đề và Câu viết Tiếng Anh cho poster nhé!');
      return;
    }

    const newProj: CreativeProject = {
      id: `cp_${Date.now()}`,
      studentId: 'current_student',
      studentName: 'Em (Nhà thám hiểm)',
      topic,
      title: title.trim(),
      caption: caption.trim(),
      stickers: selectedStickers,
      bgColor,
      createdAt: new Date().toISOString().split('T')[0],
      status,
      teacherFeedback: status === 'submitted' ? 'Đã gửi cô giáo Lê Thị Trang. Đang chờ duyệt!' : undefined,
    };

    setProjects([newProj, ...projects]);
    setIsCreating(false);
    setTitle('');
    setCaption('');

    if (status === 'submitted') {
      playCorrectChime();
      playStarDing();
      onAddStars(5);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng 8: Dự án sáng tạo Tiếng Anh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            MY CREATIVE PROJECTS 🎨
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-1">
            Thiết kế poster, viết câu Tiếng Anh và trưng bày trong thư viện triển lãm của lớp!
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-3 rounded-2xl bg-white text-fuchsia-700 hover:bg-fuchsia-50 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Đóng bảng tạo' : 'Tạo Poster mới'}
        </button>
      </div>

      {/* Creator Form */}
      {isCreating && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Xưởng Sáng Tạo Poster Tiếng Anh
            </h3>
            <span className="text-xs font-bold text-slate-400">Bước thiết kế</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  1. Chọn chủ đề dự án:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        topic === t
                          ? 'bg-fuchsia-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  2. Tiêu đề Poster (Tiếng Anh):
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: My Wonderful Family / My Cute Cat"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  3. Đoạn văn Tiếng Anh con muốn viết:
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ví dụ: This is my sweet family. I love my mother and father. We are very happy together!"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  4. Chọn hình dán sticker (tối đa 6):
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {availableStickers.map((stk) => (
                    <button
                      key={stk}
                      onClick={() => toggleSticker(stk)}
                      className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all ${
                        selectedStickers.includes(stk)
                          ? 'bg-fuchsia-500 text-white scale-110 shadow-sm'
                          : 'bg-white hover:bg-slate-200'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  5. Chọn màu sắc nền poster:
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPalettes.map((p) => (
                    <button
                      key={p.val}
                      onClick={() => setBgColor(p.val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        bgColor === p.val
                          ? 'border-fuchsia-600 ring-2 ring-fuchsia-300'
                          : 'border-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Live Poster Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500">Xem trước Poster của con:</span>
              <div
                className={`w-full min-h-[320px] rounded-3xl p-6 bg-gradient-to-br ${bgColor} border-4 border-white shadow-xl flex flex-col justify-between text-center relative overflow-hidden`}
              >
                {/* Floating stickers */}
                <div className="flex justify-center gap-3 text-3xl my-2">
                  {selectedStickers.map((s, i) => (
                    <span key={i} className="animate-bounce">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 my-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full text-slate-700 shadow-xs">
                    {topic}
                  </span>
                  <h4 className="font-heading text-2xl font-black text-slate-900">
                    {title || 'Tiêu đề Poster'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium bg-white/60 backdrop-blur-xs p-3 rounded-2xl max-w-sm mx-auto shadow-xs leading-relaxed">
                    "{caption || 'Đoạn văn Tiếng Anh của con sẽ xuất hiện ở đây thật đẹp mắt...'}"
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-600 font-bold border-t border-black/10">
                  <span>Tác giả: Em</span>
                  <span>Lớp 3A – TH Khoái Châu 1</span>
                </div>
              </div>

              {caption && (
                <button
                  onClick={() => speakEnglish(caption)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" /> Nghe thử phát âm bài thuyết trình
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => handleSaveOrSubmit('draft')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Lưu bản nháp
            </button>
            <button
              onClick={() => handleSaveOrSubmit('submitted')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-fuchsia-500/20 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Nộp cho Cô Trang nhận xét (+5 ⭐)
            </button>
          </div>
        </div>
      )}

      {/* Gallery Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-slate-800">
            Thư Viện Triển Lãm Dự Án Của Lớp
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {projects.length} tác phẩm sáng tạo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Poster mini visual */}
              <div
                className={`w-full min-h-[160px] rounded-2xl p-4 bg-gradient-to-br ${proj.bgColor} flex flex-col justify-between text-center border-2 border-white shadow-inner`}
              >
                <div className="flex justify-center gap-2 text-2xl">
                  {proj.stickers.map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>

                <div className="space-y-1 my-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-full text-slate-700">
                    {proj.topic}
                  </span>
                  <h4 className="font-heading text-lg font-black text-slate-900 leading-tight">
                    {proj.title}
                  </h4>
                </div>

                <button
                  onClick={() => speakEnglish(proj.caption)}
                  className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center justify-center gap-1 bg-white/60 rounded-lg py-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Nghe thuyết trình
                </button>
              </div>

              {/* Caption text */}
              <p className="text-xs text-slate-600 italic mt-3 leading-relaxed">
                "{proj.caption}"
              </p>

              {/* Author & Teacher Feedback */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{proj.studentName}</span>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      proj.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : proj.status === 'submitted'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {proj.status === 'approved'
                      ? '✓ Cô giáo đã duyệt'
                      : proj.status === 'submitted'
                      ? 'Đang chờ duyệt'
                      : 'Bản nháp'}
                  </span>
                </div>

                {proj.teacherFeedback && (
                  <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-xl text-[11px] text-sky-900 space-y-0.5">
                    <span className="font-bold text-sky-700 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Nhận xét của Cô Trang:
                    </span>
                    <p>{proj.teacherFeedback}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
