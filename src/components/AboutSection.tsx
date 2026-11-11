import React from 'react';
import { 
  Award, 
  Users, 
  Calendar, 
  Heart, 
  Sparkles, 
  BookOpen, 
  Mail, 
  Phone, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CLASS_INFO } from '../data/mockData';

export const AboutSection: React.FC = () => {
  return (
    <div className="py-12 space-y-16">
      
      {/* 1. Header & Slogan Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Giới Thiệu Tập Thể 10/12
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Ngôi Nhà Chung Của 42 Trái Tim Rực Rỡ
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans-body">
            Chúng mình là 10/12 trường {CLASS_INFO.school} — nơi gặp gỡ của những ước mơ, hoài bão và tình bạn trong sáng nhất của tuổi học trò.
          </p>

          {/* Slogan highlight callout */}
          <div className="pt-2">
            <div className="inline-block p-4 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 border border-sky-200/80 shadow-xs">
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Slogan Chính Thức
              </span>
              <p className="font-serif-title text-lg sm:text-2xl font-bold text-sky-900 flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>"{CLASS_INFO.slogan}"</span>
                <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Numbers & Class Identity Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-slate-900">
              Sĩ Số 42 Thành Viên
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              42 cá tính độc đáo được phân bổ thành 4 tổ học tập và ban cán sự tận tâm, luôn san sẻ bài vở và gắn bó keo sơn trong mọi hoạt động.
            </p>
            <div className="pt-2 text-xs font-semibold text-sky-600">
              21 Nam • 21 Nữ (Tỷ lệ cân đối hoàn hảo)
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-slate-900">
              Niên Khóa 2024 - 2027
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hành trình 1000 ngày thanh xuân dưới mái trường THPT thân yêu, cùng nhau nỗ lực vượt qua các kỳ thi và viết nên những kỷ niệm khó phai.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-600">
              Chặng đường: Lớp 10 ➔ Lớp 11 ➔ Lớp 12
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-slate-900">
              Tinh Thần 10/12
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Học hết sức, chơi hết mình! Luôn nhiệt huyết trên sân thi đấu, rực sáng trên sân khấu văn nghệ và nghiêm túc trong giờ kiểm tra.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-600">
              Đoàn kết • Sáng tạo • Yêu thương
            </div>
          </div>
        </div>
      </section>

      {/* 3. Meet the Head Teacher (Cô Chủ Nhiệm) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/50 to-blue-50 border border-sky-100 p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Teacher Portrait */}
            <div className="lg:col-span-4 text-center">
              <div className="relative inline-block">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                  <img
                    src={CLASS_INFO.headTeacher.avatar}
                    alt={CLASS_INFO.headTeacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-gradient-to-r from-sky-600 to-blue-700 text-white p-2.5 rounded-full shadow-lg border-2 border-white">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  {CLASS_INFO.headTeacher.role}
                </span>
                <h3 className="font-serif-title text-2xl font-bold text-slate-900 mt-2">
                  {CLASS_INFO.headTeacher.name}
                </h3>
                <p className="text-sm text-slate-600 font-medium mt-0.5">
                  {CLASS_INFO.headTeacher.subject}
                </p>
              </div>
            </div>

            {/* Teacher Note & Quote */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Lời Nhắn Gửi Yêu Thương Từ Cô Chủ Nhiệm</span>
              </div>

              <blockquote className="font-serif-title italic text-lg sm:text-xl text-slate-800 leading-relaxed bg-white/70 p-6 rounded-2xl border border-sky-100 shadow-xs">
                "{CLASS_INFO.headTeacher.message}"
              </blockquote>

              <p className="text-sm text-slate-600 leading-relaxed">
                Cô không chỉ truyền dạy cho 10/12 từng áng văn hay, bài thơ đẹp, mà còn là người luôn lắng nghe mọi tâm tư, giải tỏa những áp lực và che chở cho đàn con trong mọi hoạt động thi đua của nhà trường.
              </p>

              {/* Contact info info badges */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <span>Email: {CLASS_INFO.headTeacher.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Điện thoại GVCN: {CLASS_INFO.headTeacher.phone}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Achievements Timeline & Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900">
                Bảng Vàng Thành Tích Của Lớp
              </h2>
              <p className="text-sm text-slate-500">Những dấu son rực rỡ mà tập thể 10/12 đã cùng nhau gặt hái</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {CLASS_INFO.achievements.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                🏆
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    Năm {item.year}
                  </span>
                </div>
                <h3 className="font-serif-title text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 4 Teams Structure (Sơ đồ 4 Tổ Học Tập) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900">
            Cơ Cấu 4 Tổ Học Tập
          </h2>
          <p className="text-sm text-slate-500">
            Mỗi tổ là một mũi nhọn tiên phong, hỗ trợ nhau trong học tập và rèn luyện nề nếp
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif-title font-bold text-lg text-sky-700">Tổ 1</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">10 Bạn</span>
            </div>
            <div className="text-xs text-slate-500">
              Tổ trưởng: <strong className="text-slate-800">Khánh Linh</strong>
            </div>
            <p className="text-xs text-slate-600">
              Thế mạnh: Ban Khoa học Xã hội, khéo tay trang trí bảng, chữ đẹp và văn nghệ xuất sắc.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Điểm thi đua tuần: Xuất sắc</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif-title font-bold text-lg text-blue-700">Tổ 2</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">10 Bạn</span>
            </div>
            <div className="text-xs text-slate-500">
              Tổ trưởng: <strong className="text-slate-800">Gia Bảo</strong>
            </div>
            <p className="text-xs text-slate-600">
              Thế mạnh: Ngoại ngữ, múa truyền thống và là trung tâm nhiếp ảnh của lớp với Minh Xoăn.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Điểm thi đua tuần: Xuất sắc</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif-title font-bold text-lg text-indigo-700">Tổ 3</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">11 Bạn</span>
            </div>
            <div className="text-xs text-slate-500">
              Tổ trưởng: <strong className="text-slate-800">Cẩm Tú</strong>
            </div>
            <p className="text-xs text-slate-600">
              Thế mạnh: Khoa học Tự nhiên, Toán - Lý - Hóa, ban nhạc acoustic và các tài năng guitar.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Điểm thi đua tuần: Xuất sắc</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif-title font-bold text-lg text-amber-700">Tổ 4</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">11 Bạn</span>
            </div>
            <div className="text-xs text-slate-500">
              Tổ trưởng: <strong className="text-slate-800">Minh Khang</strong>
            </div>
            <p className="text-xs text-slate-600">
              Thế mạnh: Thể thao, kéo co, điền kinh và tài năng tranh biện lý luận sắc bén.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Điểm thi đua tuần: Xuất sắc</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
