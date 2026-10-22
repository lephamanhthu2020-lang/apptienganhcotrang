import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Sparkles,
  BookOpen,
  TrendingUp,
  FileText,
  Plus,
  CheckCircle2,
  Download,
  Printer,
  Calendar,
  Layers,
  Search,
  Filter,
  BarChart3,
  Bot,
  AlertCircle,
} from 'lucide-react';
import {
  BEFORE_AFTER_STATS,
  DEMO_ASSIGNMENTS,
  DEMO_CLASSROOMS,
  DEMO_STUDENTS,
} from '../data/teacherDemoData';
import { HomeworkAssignment, StudentProfile } from '../types';

export const TeacherDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'ai-creator' | 'assignments' | 'analytics'>('analytics');
  const [selectedClass, setSelectedClass] = useState('class-3a');
  const [students, setStudents] = useState<StudentProfile[]>(DEMO_STUDENTS);
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(DEMO_ASSIGNMENTS);

  // AI Lesson Creator state
  const [aiGrade, setAiGrade] = useState('3');
  const [aiLessonName, setAiLessonName] = useState('My Favourite Toys');
  const [aiTopic, setAiTopic] = useState('Toys and Games');
  const [aiObjectives, setAiObjectives] = useState('Học từ vựng về đồ chơi và mẫu câu I have a...');
  const [aiVocabCount, setAiVocabCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('Phát triển');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);

  // New Student modal / state
  const [newStudentNickname, setNewStudentNickname] = useState('');
  const [newStudentTier, setNewStudentTier] = useState<'support' | 'core' | 'advanced'>('core');
  const [showAddStudent, setShowAddStudent] = useState(false);

  // New Assignment state
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwDueDate, setNewHwDueDate] = useState('2026-10-30');
  const [newHwTier, setNewHwTier] = useState<'all' | 'support' | 'core' | 'advanced'>('all');

  // Trigger Gemini AI Lesson Generation
  const handleGenerateLesson = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeLevel: aiGrade,
          lessonName: aiLessonName,
          topic: aiTopic,
          objectives: aiObjectives,
          vocabCount: aiVocabCount,
          difficulty: aiDifficulty,
        }),
      });

      const data = await res.json();
      setGeneratedLesson(data);
    } catch (e) {
      alert('Không thể kết nối đến máy chủ AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddStudent = () => {
    if (!newStudentNickname.trim()) return;
    const newSt: StudentProfile = {
      id: `st_${Date.now()}`,
      name: `${newStudentNickname.trim()} (Học sinh)`,
      nickname: newStudentNickname.trim(),
      avatarSeed: '🌟',
      gradeLevel: 3,
      className: 'Lớp 3A',
      studentCode: `KC3A-${students.length + 1}`,
      initialSurveyScore: 70,
      initialTier: newStudentTier,
      currentTier: newStudentTier,
      stars: 10,
      streakDays: 1,
      completedStages: [],
      vocabularyMastered: [],
      badges: [],
      speakingScores: [],
    };
    setStudents([...students, newSt]);
    setNewStudentNickname('');
    setShowAddStudent(false);
  };

  const handleCreateAssignment = () => {
    if (!newHwTitle.trim()) return;
    const newAss: HomeworkAssignment = {
      id: `hw_${Date.now()}`,
      title: newHwTitle.trim(),
      className: 'Lớp 3A',
      targetTier: newHwTier,
      stageId: 'island-1',
      dueDate: newHwDueDate,
      completedCount: 0,
      totalCount: students.length,
    };
    setAssignments([...assignments, newAss]);
    setNewHwTitle('');
    setShowAddAssignment(false);
  };

  // Export CSV report
  const exportCSV = () => {
    const headers = ['Mã HS', 'Tên/Biệt danh', 'Lớp', 'Điểm đầu vào', 'Nhóm học tập', 'Số sao', 'Chuỗi ngày'];
    const rows = students.map((s) => [
      s.studentCode,
      s.name,
      s.className,
      s.initialSurveyScore || 0,
      s.currentTier || 'core',
      s.stars,
      s.streakDays,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_Cao_Tien_Do_Lop_3A_EnglishBuddy.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl border border-white/30 shadow-md">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Khu vực quản lý sư phạm
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                DỮ LIỆU DEMO
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading mt-0.5">
              Bảng Điều Khiển Giáo Viên – Cô Lê Thị Trang
            </h2>
            <p className="text-xs sm:text-sm text-sky-100">
              Trường Tiểu học Khoái Châu 1 – Tỉnh Hưng Yên | Phân hóa & Thiết kế học liệu AI
            </p>
          </div>
        </div>

        {/* Quick export button */}
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-sky-50 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Xuất Báo Cáo (CSV)
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold border border-white/30"
            title="In trang báo cáo"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-100 shadow-xs overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'analytics'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> 1. Báo cáo & Biểu đồ tiến bộ
        </button>

        <button
          onClick={() => setActiveSubTab('classes')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'classes'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> 2. Danh sách lớp & Phân hóa ({students.length})
        </button>

        <button
          onClick={() => setActiveSubTab('ai-creator')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'ai-creator'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" /> 3. Soạn học liệu AI (AI Lesson Creator)
        </button>

        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'assignments'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" /> 4. Giao nhiệm vụ & Bài tập ({assignments.length})
        </button>
      </div>

      {/* ==================== SUB-TAB 1: ANALYTICS & COMPARISON ==================== */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Tổng số học sinh</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-800">28 em</div>
              <span className="text-[11px] font-bold text-emerald-600">100% tham gia khảo sát</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Tỉ lệ hoàn thành bài</span>
              <div className="text-2xl sm:text-3xl font-black text-sky-600">89.4%</div>
              <span className="text-[11px] font-bold text-slate-500">+24% so với trước khi dùng AI</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Điểm TB khảo sát đầu</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">50.3 / 100</div>
              <span className="text-[11px] font-bold text-slate-400">Lần 1 (Đầu học kỳ)</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Điểm TB hiện tại</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">84.0 / 100</div>
              <span className="text-[11px] font-bold text-emerald-600">▲ Tăng 33.7 điểm</span>
            </div>
          </div>

          {/* Section VI.2: Before and After Comparative Bar Visual */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
                  Biểu đồ so sánh trước và sau khi ứng dụng English Buddy AI
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-800 mt-1">
                  Hiệu Quả Can Thiệp & Tiến Bộ Ngôn Ngữ
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-slate-300" /> Trước ứng dụng (Khảo sát đầu vào)
                </span>
                <span className="flex items-center gap-1.5 text-sky-600">
                  <span className="w-3 h-3 rounded-full bg-sky-500" /> Sau 6 tuần học cùng Buddy
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {BEFORE_AFTER_STATS.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700">
                    <span>{stat.skill}</span>
                    <span className="text-emerald-600 font-black">
                      {stat.before}đ ➔ {stat.after}đ (+{stat.after - stat.before}đ)
                    </span>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1.5">
                    {/* Before Bar */}
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex items-center">
                      <div
                        className="h-full bg-slate-400 rounded-full transition-all duration-700"
                        style={{ width: `${stat.before}%` }}
                      />
                    </div>
                    {/* After Bar */}
                    <div className="w-full h-5 bg-sky-50 rounded-full overflow-hidden flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[10px] text-white font-bold"
                        style={{ width: `${stat.after}%` }}
                      >
                        {stat.after}%
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">{stat.note}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-center gap-2 text-xs text-sky-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Nhận định chuyên môn của giáo viên:</strong> Kỹ năng Luyện nói (Speaking) có mức tăng trưởng ngoạn mục nhất (+41 điểm), chứng minh robot AI Buddy đã giải quyết triệt để rào cản sợ sai và e ngại giao tiếp ở học sinh tiểu học.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 2: CLASS LIST & DIFFERENTIATION ==================== */}
      {activeSubTab === 'classes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                Quản lý lớp học & Phân hóa năng lực
              </span>
              <h3 className="font-heading text-xl font-bold text-slate-800 mt-1">
                Lớp 3A – Trường Tiểu học Khoái Châu 1 (Mã: KC1-3A)
              </h3>
              <p className="text-xs text-slate-500">
                Học sinh được định danh bằng biệt danh đáng yêu, đảm bảo an toàn thông tin cá nhân.
              </p>
            </div>

            <button
              onClick={() => setShowAddStudent(true)}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Thêm học sinh mới
            </button>
          </div>

          {/* Differentiated Group Summary Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-700 block">🌱 Nhóm Củng cố nền tảng</span>
              <div className="text-xl font-black text-amber-900 mt-1">
                {students.filter((s) => s.currentTier === 'support').length} em
              </div>
              <p className="text-[11px] text-amber-700/80 mt-1">
                Cần học liệu nghe chậm, thẻ từ minh họa lớn
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-blue-700 block">🚀 Nhóm Phát triển (Chuẩn)</span>
              <div className="text-xl font-black text-blue-900 mt-1">
                {students.filter((s) => s.currentTier === 'core').length} em
              </div>
              <p className="text-[11px] text-blue-700/80 mt-1">
                Đạt chuẩn mục tiêu bài học Chương trình GDPT 2018
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-xs font-bold text-purple-700 block">🌟 Nhóm Khám phá nâng cao</span>
              <div className="text-xl font-black text-purple-900 mt-1">
                {students.filter((s) => s.currentTier === 'advanced').length} em
              </div>
              <p className="text-[11px] text-purple-700/80 mt-1">
                Luyện nói hội thoại mở rộng và làm dự án sáng tạo
              </p>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Mã HS</th>
                  <th className="p-3">Biệt danh học sinh</th>
                  <th className="p-3">Điểm khảo sát đầu</th>
                  <th className="p-3">Nhóm năng lực</th>
                  <th className="p-3">Số sao ⭐</th>
                  <th className="p-3">Chuỗi ngày 🔥</th>
                  <th className="p-3">Hành động của giáo viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-mono font-bold text-slate-500">{st.studentCode}</td>
                    <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-base">{st.avatarSeed}</span>
                      <span>{st.name}</span>
                    </td>
                    <td className="p-3 font-bold text-sky-600">{st.initialSurveyScore} / 100</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          st.currentTier === 'advanced'
                            ? 'bg-purple-100 text-purple-700'
                            : st.currentTier === 'core'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {st.currentTier === 'advanced'
                          ? 'Nâng cao'
                          : st.currentTier === 'core'
                          ? 'Phát triển'
                          : 'Củng cố'}
                      </span>
                    </td>
                    <td className="p-3 font-black text-amber-500">{st.stars}</td>
                    <td className="p-3 text-orange-500 font-bold">{st.streakDays} ngày</td>
                    <td className="p-3">
                      <select
                        value={st.currentTier}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setStudents((prev) =>
                            prev.map((item) => (item.id === st.id ? { ...item, currentTier: val } : item))
                          );
                        }}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                      >
                        <option value="support">Chuyển sang Củng cố</option>
                        <option value="core">Chuyển sang Phát triển</option>
                        <option value="advanced">Chuyển sang Nâng cao</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Student Modal */}
          {showAddStudent && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <h4 className="font-heading text-lg font-bold text-slate-800">Thêm học sinh mới vào lớp</h4>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Biệt danh học sinh (Ví dụ: Tôm, Bông, Thỏ):
                  </label>
                  <input
                    type="text"
                    value={newStudentNickname}
                    onChange={(e) => setNewStudentNickname(e.target.value)}
                    placeholder="Nhập biệt danh..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Nhóm năng lực:</label>
                  <select
                    value={newStudentTier}
                    onChange={(e) => setNewStudentTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    <option value="support">Củng cố nền tảng</option>
                    <option value="core">Phát triển (Mặc định)</option>
                    <option value="advanced">Khám phá nâng cao</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddStudent(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddStudent}
                    className="px-5 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold"
                  >
                    Thêm ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== SUB-TAB 3: AI LESSON CREATOR ==================== */}
      {activeSubTab === 'ai-creator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Chức năng: AI Lesson Creator (Gemini AI)
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-800 mt-1">
              Thiết Kế Học Liệu Tiếng Anh Thông Minh
            </h3>
            <p className="text-xs text-slate-500">
              Chỉ cần nhập tên bài và mục tiêu, Gemini AI sẽ tạo ngay từ vựng, hội thoại, trắc nghiệm và kế hoạch phân hóa 3 tầng cho giáo viên duyệt.
            </p>
          </div>

          {/* Generator Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Khối lớp:</label>
              <select
                value={aiGrade}
                onChange={(e) => setAiGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="1">Lớp 1</option>
                <option value="2">Lớp 2</option>
                <option value="3">Lớp 3</option>
                <option value="4">Lớp 4</option>
                <option value="5">Lớp 5</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tên bài học:</label>
              <input
                type="text"
                value={aiLessonName}
                onChange={(e) => setAiLessonName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đề:</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Mục tiêu bài học:</label>
              <input
                type="text"
                value={aiObjectives}
                onChange={(e) => setAiObjectives(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng từ vựng:</label>
              <input
                type="number"
                min={3}
                max={10}
                value={aiVocabCount}
                onChange={(e) => setAiVocabCount(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={isGenerating}
              onClick={handleGenerateLesson}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              {isGenerating ? 'AI đang thiết kế học liệu...' : 'Tạo Học Liệu Bằng Gemini AI'}
            </button>
          </div>

          {/* Generated Lesson Preview */}
          {generatedLesson && (
            <div className="space-y-6 pt-4 border-t border-slate-200 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Đã tạo thành công bài học
                  </span>
                  <h4 className="font-heading text-xl font-bold text-slate-800 mt-1">
                    {generatedLesson.lessonName} (Khối {generatedLesson.gradeLevel})
                  </h4>
                </div>
                <button
                  onClick={() => alert('Đã phê duyệt và thêm bài học vào hệ thống phân phối cho học sinh!')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  ✓ Phê duyệt & Giao cho lớp
                </button>
              </div>

              {/* Vocabularies generated */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  1. Danh mục từ vựng trọng tâm:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {generatedLesson.vocabularies?.map((v: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="font-bold text-slate-800 text-sm">{v.word}</div>
                      <div className="text-xs text-sky-600">{v.phonetic}</div>
                      <div className="text-xs text-slate-600 mt-1">{v.meaning}</div>
                      <div className="text-[11px] text-slate-400 italic mt-0.5">"{v.example}"</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiated Tiers Plan */}
              {generatedLesson.differentiatedTiers && (
                <div className="p-5 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 rounded-2xl border border-sky-100 space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-900">
                    2. Kế hoạch dạy học phân hóa 3 tầng:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                      <strong className="text-amber-800 block mb-1">🌱 Tầng Củng cố nền tảng:</strong>
                      <p className="text-slate-600">{generatedLesson.differentiatedTiers.tier1Support}</p>
                    </div>
                    <div className="p-3 bg-white/80 rounded-xl border border-blue-200">
                      <strong className="text-blue-800 block mb-1">🚀 Tầng Phát triển:</strong>
                      <p className="text-slate-600">{generatedLesson.differentiatedTiers.tier2Core}</p>
                    </div>
                    <div className="p-3 bg-white/80 rounded-xl border border-purple-200">
                      <strong className="text-purple-800 block mb-1">🌟 Tầng Nâng cao:</strong>
                      <p className="text-slate-600">{generatedLesson.differentiatedTiers.tier3Advanced}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== SUB-TAB 4: ASSIGNMENTS ==================== */}
      {activeSubTab === 'assignments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Quản lý nhiệm vụ học tập
              </span>
              <h3 className="font-heading text-xl font-bold text-slate-800 mt-1">
                Danh Sách Nhiệm Vụ Giao Cho Lớp 3A
              </h3>
            </div>

            <button
              onClick={() => setShowAddAssignment(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Giao nhiệm vụ mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignments.map((ass) => (
              <div
                key={ass.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Hạn: {ass.dueDate}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {ass.targetTier === 'all'
                        ? 'Cả lớp'
                        : ass.targetTier === 'support'
                        ? 'Nhóm củng cố'
                        : 'Nhóm nâng cao'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{ass.title}</h4>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span>Đã hoàn thành:</span>
                    <span>
                      {ass.completedCount} / {ass.totalCount} em
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(ass.completedCount / ass.totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Assignment Modal */}
          {showAddAssignment && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <h4 className="font-heading text-lg font-bold text-slate-800">Giao nhiệm vụ học tập mới</h4>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tên nhiệm vụ:</label>
                  <input
                    type="text"
                    value={newHwTitle}
                    onChange={(e) => setNewHwTitle(e.target.value)}
                    placeholder="Ví dụ: Ôn tập 5 từ vựng đồ chơi và làm quiz..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Giao cho đối tượng:</label>
                  <select
                    value={newHwTier}
                    onChange={(e) => setNewHwTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    <option value="all">Toàn bộ lớp 3A</option>
                    <option value="support">Chỉ nhóm Củng cố nền tảng</option>
                    <option value="core">Chỉ nhóm Phát triển</option>
                    <option value="advanced">Chỉ nhóm Khám phá nâng cao</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Hạn nộp:</label>
                  <input
                    type="date"
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddAssignment(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateAssignment}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Giao bài ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
