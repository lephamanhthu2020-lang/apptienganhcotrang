import React from 'react';
import {
  FolderKanban,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { INTEGRATED_TOOLS } from '../data/teacherDemoData';

export const ResourceHub: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng 10: Kho học liệu số tích hợp
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            HỆ SINH THÁI 8 CÔNG CỤ DẠY HỌC SỐ
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Các công cụ công nghệ giáo dục hiện đại được giáo viên Lê Thị Trang kết nối nhằm làm phong phú giờ học Tiếng Anh tiểu học.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs font-bold text-center">
          <span className="text-cyan-200 block text-[10px]">Tiêu chuẩn:</span>
          Chương trình GDPT 2018
        </div>
      </div>

      {/* 8 Integrated Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INTEGRATED_TOOLS.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-2xl ${tool.iconColor} text-white flex items-center justify-center font-bold text-sm shadow-md`}
                >
                  {tool.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {tool.category}
                </span>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-slate-800">{tool.name}</h3>
                <span className="text-[11px] font-bold text-indigo-600 block mt-0.5">
                  {tool.role}
                </span>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{tool.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {tool.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href={tool.link}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <span>Mở công cụ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Note */}
      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 leading-relaxed">
        <strong>Hướng dẫn cho giáo viên:</strong> Kho học liệu tích hợp cung cấp cổng truy cập nhanh đến các công cụ bổ trợ hàng đầu. Thầy cô có thể sử dụng ChatGPT/Gemini để lên ý tưởng, Canva thiết kế flashcard in ấn, Suno tạo giai điệu cho bài thơ Tiếng Anh và Padlet để phụ huynh cùng ngắm nhìn sản phẩm của học sinh.
      </div>
    </div>
  );
};
