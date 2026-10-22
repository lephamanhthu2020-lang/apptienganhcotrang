import React from 'react';
import {
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  Layers,
  Award,
  BookOpen,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Target,
  FileCheck,
} from 'lucide-react';
import { BuddyAvatar } from './BuddyAvatar';

interface ProjectShowcaseProps {
  onBackToHome: () => void;
  onStartDemo: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onBackToHome, onStartDemo }) => {
  const posterSections = [
    {
      num: '01',
      title: 'Thông Tin Tác Giả & Đơn Vị Triển Khai',
      icon: Users,
      color: 'bg-blue-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            • <strong>Giáo viên đề xuất & thực hiện:</strong> Cô <strong>Lê Thị Trang</strong>
          </p>
          <p>
            • <strong>Đơn vị:</strong> Trường Tiểu học Khoái Châu 1 – Tỉnh Hưng Yên
          </p>
          <p>
            • <strong>Môn học:</strong> Tiếng Anh Tiểu học (Chương trình GDPT 2018)
          </p>
          <p>
            • <strong>Đối tượng thụ hưởng:</strong> Học sinh các khối Lớp 1, 2, 3, 4, 5
          </p>
          <p>
            • <strong>Tôn chỉ:</strong> "Cá nhân hóa – Tương tác – Truyền cảm hứng"
          </p>
        </div>
      ),
    },
    {
      num: '02',
      title: 'Bối Cảnh & Nhu Cầu Cấp Thiết',
      icon: Target,
      color: 'bg-rose-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Thực trạng:</strong> Sĩ số lớp học tiểu học thường từ 28–35 học sinh, thời lượng tiết học 35 phút khiến giáo viên khó có thể chỉnh âm, luyện nói 1:1 cho từng em.
          </p>
          <p>
            • <strong>Rào cản tâm lý:</strong> Nhiều học sinh tiểu học e ngại, sợ phát âm sai trước bạn bè, dẫn đến việc thiếu tự tin và phản xạ chậm khi giao tiếp.
          </p>
          <p>
            • <strong>Chênh lệch xuất phát điểm:</strong> Năng lực tiếp thu và môi trường tiếp cận Tiếng Anh của các em không đồng đều, đòi hỏi giải pháp dạy học phân hóa linh hoạt.
          </p>
        </div>
      ),
    },
    {
      num: '03',
      title: 'Ý Tưởng & Giải Pháp Sáng Kiến',
      icon: Compass,
      color: 'bg-amber-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Người bạn AI đồng hành (Buddy):</strong> Xây dựng nhân vật robot AI 3D thân thiện, kiên nhẫn, tạo cảm giác học tập như một trò chơi thám hiểm diệu kỳ.
          </p>
          <p>
            • <strong>Bản đồ 8 Hòn Đảo Ngôn Ngữ:</strong> Thiết kế lộ trình học theo dạng nhiệm vụ (quest), kết hợp từ vựng, nghe, nói, game và bài kiểm tra 3 sao.
          </p>
          <p>
            • <strong>Cá nhân hóa 3 tầng:</strong> Tự động phân loại năng lực sau khảo sát (Củng cố - Phát triển - Nâng cao) để giao học liệu phù hợp với từng em.
          </p>
        </div>
      ),
    },
    {
      num: '04',
      title: 'Hệ Thống Công Cụ Công Nghệ & AI Sử Dụng',
      icon: Cpu,
      color: 'bg-purple-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Google Gemini AI (3.8-Flash):</strong> Xử lý ngôn ngữ tự nhiên, gia sư ảo trả lời thắc mắc, phân tích câu nói và hỗ trợ giáo viên soạn giáo án phân hóa.
          </p>
          <p>
            • <strong>Web Speech API:</strong> Nhận diện giọng nói hai chiều và phát âm giọng Anh chuẩn bản xứ với 2 chế độ tốc độ (chậm 0.75x và bình thường 1.0x).
          </p>
          <p>
            • <strong>Web Audio Synthesizer:</strong> Tổng hợp âm thanh chúc mừng, fanfare, hiệu ứng ngôi sao không phụ thuộc vào file bên ngoài.
          </p>
          <p>
            • <strong>Bộ 8 công cụ số:</strong> Canva, ChatGPT, Suno, Wordwall, Quizizz, Padlet, CapCut.
          </p>
        </div>
      ),
    },
    {
      num: '05',
      title: 'Quy Trình Triển Khai 6 Bước Khép Kín',
      icon: Layers,
      color: 'bg-emerald-500',
      content: (
        <div className="space-y-1.5 text-xs text-slate-600">
          <p><strong>Bước 1:</strong> Khảo sát năng lực đầu vào 10 câu hỏi sinh động.</p>
          <p><strong>Bước 2:</strong> Hệ thống tự động đề xuất lộ trình và phân nhóm 3 tầng.</p>
          <p><strong>Bước 3:</strong> Học sinh khám phá Đảo Ngôn Ngữ: Từ vựng, nghe, nói với Buddy.</p>
          <p><strong>Bước 4:</strong> Củng cố bằng Game Zone và làm dự án sáng tạo poster.</p>
          <p><strong>Bước 5:</strong> Giáo viên theo dõi dashboard, nhận xét và giao bài tập cá nhân.</p>
          <p><strong>Bước 6:</strong> Phụ huynh xem tiến độ tại nhà, duy trì chuỗi học tập.</p>
        </div>
      ),
    },
    {
      num: '06',
      title: 'Minh Chứng Sản Phẩm Học Sinh',
      icon: BookOpen,
      color: 'bg-cyan-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Kho Poster Sáng Tạo:</strong> Hàng chục poster tiếng Anh do chính các em thiết kế (My Family, My School, My Dream...) được triển lãm trong lớp.
          </p>
          <p>
            • <strong>Bản ghi âm luyện nói:</strong> Các lượt giao tiếp phản xạ thực tế giữa học sinh và robot Buddy.
          </p>
          <p>
            • <strong>Bộ sưu tập huy hiệu:</strong> Học sinh hào hứng thi đua đạt huy hiệu "Mạnh dạn luyện nói", "Bậc thầy từ vựng".
          </p>
        </div>
      ),
    },
    {
      num: '07',
      title: 'Kết Quả & Tác Động Sư Phạm',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Kỹ năng nói tăng vọt (+41 điểm):</strong> Từ điểm TB 41 lên 82 điểm sau khi được luyện tập hàng ngày cùng robot Buddy.
          </p>
          <p>
            • <strong>Tỷ lệ hoàn thành bài tập đạt 89.4%:</strong> Học sinh chủ động mở web học tập tại nhà nhờ yếu tố game hóa và huy hiệu.
          </p>
          <p>
            • <strong>Mức độ tự tin đạt 4.6 / 5 điểm:</strong> 94% phụ huynh ghi nhận con không còn e sợ khi gặp người nước ngoài hoặc giáo viên bản ngữ.
          </p>
        </div>
      ),
    },
    {
      num: '08',
      title: 'Tính Khả Thi & Khả Năng Mở Rộng',
      icon: CheckCircle2,
      color: 'bg-teal-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Không cần cài đặt phức tạp:</strong> Ứng dụng chạy trực tiếp trên trình duyệt máy tính, máy tính bảng và điện thoại thông minh.
          </p>
          <p>
            • <strong>Chi phí triển khai tối ưu:</strong> Tận dụng các mô hình AI tiên tiến và hạ tầng đám mây hiện đại.
          </p>
          <p>
            • <strong>Dễ dàng nhân rộng:</strong> Cấu trúc module cho phép áp dụng ngay cho các trường tiểu học trong toàn huyện Khoái Châu và toàn tỉnh Hưng Yên.
          </p>
        </div>
      ),
    },
    {
      num: '09',
      title: 'Định Hướng Phát Triển Tương Lai',
      icon: Sparkles,
      color: 'bg-fuchsia-500',
      content: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Tích hợp không gian 3D/AR:</strong> Cho phép học sinh tương tác với đồ vật thực tế qua camera để học từ vựng trực quan hơn.
          </p>
          <p>
            • <strong>Mở rộng hội thoại đa văn hóa:</strong> Giúp học sinh giới thiệu về di tích lịch sử và văn hóa quê hương Khoái Châu bằng Tiếng Anh.
          </p>
          <p>
            • <strong>Phát triển phiên bản ngoại tuyến (Offline PWA):</strong> Giúp các học sinh ở khu vực mạng yếu vẫn có thể ôn tập từ vựng mượt mà.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Showcase Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-black text-xs">
              HỒ SƠ SÁNG KIẾN GIÁO DỤC AI
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs">
              Dành cho Ban Giám Khảo & Đồng Nghiệp
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-heading leading-tight">
            ENGLISH BUDDY AI – AI ĐỒNG HÀNH CÙNG HỌC SINH TIỂU HỌC HỌC TIẾNG ANH
          </h1>

          <p className="text-sm sm:text-base text-sky-100 italic font-medium">
            Sáng kiến kinh nghiệm nâng cao năng lực giao tiếp và hứng thú học Tiếng Anh cho học sinh tiểu học thông qua trí tuệ nhân tạo cá nhân hóa.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onStartDemo}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-900" /> TRẢI NGHIỆM TRỰC TIẾP (DEMO)
            </button>
            <button
              onClick={onBackToHome}
              className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-xs sm:text-sm border border-white/30 transition-all"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>

      {/* 9 Poster Sections Grid */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            Cấu trúc 9 phần hoàn chỉnh theo Poster sáng kiến
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Nội Dung Chi Tiết Của Sáng Kiến Giáo Dục
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posterSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.num}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 font-mono">
                      MỤC {sec.num}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl ${sec.color} text-white flex items-center justify-center shadow-xs`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-base font-bold text-slate-800 leading-snug">
                    {sec.title}
                  </h3>

                  <div className="pt-2 border-t border-slate-100">{sec.content}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance & Authenticity Disclaimer */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-700">Tuyên bố tính minh bạch & bản quyền sáng kiến:</p>
        <p>
          Sản phẩm do cô <strong>Lê Thị Trang</strong> (Trường Tiểu học Khoái Châu 1) đề xuất và trực tiếp tham gia xây dựng nội dung. Dữ liệu khảo sát và bảng số liệu minh họa đã được gắn nhãn minh bạch. Không sử dụng logo các tổ chức khi chưa có sự ủy quyền chính thức.
        </p>
      </div>
    </div>
  );
};
