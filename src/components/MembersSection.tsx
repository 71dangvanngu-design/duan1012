import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  Users, 
  Sparkles, 
  Heart, 
  Calendar, 
  Briefcase, 
  Edit3, 
  Trash2, 
  X, 
  ExternalLink,
  Filter,
  Check
} from 'lucide-react';
import { Member } from '../types';
import { filterMembers, calculateZodiac, formatVietnameseDate } from '../utils/classUtils';

interface MembersSectionProps {
  members: Member[];
  onAddMember: (newMember: Member) => void;
  onUpdateMember: (updatedMember: Member) => void;
  onDeleteMember: (id: string) => void;
}

export const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('Tất cả');
  
  // Profile Detail Modal State
  const [activeProfile, setActiveProfile] = useState<Member | null>(null);

  // Edit / Add Modal State
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Member | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    role: 'Thành viên',
    team: 'Tổ 1' as Member['team'],
    avatar: '',
    birthday: '2009-01-01',
    quote: '',
    hobbies: '',
    dreamJob: '',
    funFact: ''
  });

  const teams = ['Tất cả', 'Ban cán sự', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'];

  const filteredMembers = useMemo(() => {
    return filterMembers(members, searchQuery, selectedTeam);
  }, [members, searchQuery, selectedTeam]);

  // Open modal for new member
  const handleOpenAddModal = () => {
    setEditingTarget(null);
    setFormData({
      name: '',
      nickname: '',
      role: 'Thành viên',
      team: 'Tổ 1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      birthday: '2009-05-15',
      quote: 'Học hết mình, chơi nhiệt tình!',
      hobbies: 'Đọc sách, Nghe nhạc, Cầu lông',
      dreamJob: 'Kỹ sư công nghệ',
      funFact: 'Luôn đem đồ ăn vặt đi học'
    });
    setIsEditingModalOpen(true);
  };

  // Open modal for editing existing member
  const handleOpenEditModal = (member: Member, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTarget(member);
    setFormData({
      name: member.name,
      nickname: member.nickname,
      role: member.role,
      team: member.team,
      avatar: member.avatar,
      birthday: member.birthday || '2009-01-01',
      quote: member.quote,
      hobbies: member.hobbies.join(', '),
      dreamJob: member.dreamJob || '',
      funFact: member.funFact || ''
    });
    setIsEditingModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedHobbies = formData.hobbies
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    if (editingTarget) {
      // Update
      const updated: Member = {
        ...editingTarget,
        name: formData.name,
        nickname: formData.nickname || 'Bạn thân',
        role: formData.role,
        team: formData.team,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        birthday: formData.birthday,
        quote: formData.quote || 'Thanh xuân 10/12 rực rỡ!',
        hobbies: parsedHobbies.length > 0 ? parsedHobbies : ['Học tập', 'Vui chơi'],
        dreamJob: formData.dreamJob,
        funFact: formData.funFact,
      };
      onUpdateMember(updated);
      if (activeProfile?.id === updated.id) {
        setActiveProfile(updated);
      }
    } else {
      // Create new
      const newMem: Member = {
        id: 'm_' + Date.now(),
        name: formData.name,
        nickname: formData.nickname || 'Thành viên mới',
        role: formData.role,
        team: formData.team,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        birthday: formData.birthday,
        quote: formData.quote || 'Tự hào là một thành viên của 10/12!',
        hobbies: parsedHobbies.length > 0 ? parsedHobbies : ['Âm nhạc', 'Thể thao'],
        dreamJob: formData.dreamJob,
        funFact: formData.funFact,
      };
      onAddMember(newMem);
    }

    setIsEditingModalOpen(false);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên "${name}" khỏi danh sách lớp không?`)) {
      onDeleteMember(id);
      if (activeProfile?.id === id) {
        setActiveProfile(null);
      }
    }
  };

  return (
    <div className="py-12 space-y-10">
      
      {/* 1. Page Header & Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              Đại Gia Đình 10/12
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-slate-900">
              Danh Sách Thành Viên Lớp ({members.length})
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Nơi lưu giữ gương mặt, biệt danh và những câu chuyện thú vị của từng cá tính trong tập thể chúng mình.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-sm font-semibold shadow-md shadow-sky-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm thành viên mới</span>
          </button>
        </div>

        {/* 2. Search & Filters Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, biệt danh, sở thích..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Team Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTeam === team
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {team}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Members Grid Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif-title text-lg font-bold text-slate-700">
              Không tìm thấy thành viên phù hợp
            </h3>
            <p className="text-sm text-slate-500">
              Hãy thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc tổ về "Tất cả".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTeam('Tất cả');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => {
              const zodiac = member.zodiac || calculateZodiac(member.birthday);

              return (
                <div
                  key={member.id}
                  onClick={() => setActiveProfile(member)}
                  className="group relative rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                >
                  {/* Top image & banner */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Role badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs border ${
                        member.role.includes('Lớp') || member.role.includes('Bí thư')
                          ? 'bg-amber-100/90 text-amber-900 border-amber-300 backdrop-blur-xs'
                          : member.role.includes('Tổ')
                          ? 'bg-sky-100/90 text-sky-900 border-sky-300 backdrop-blur-xs'
                          : 'bg-white/90 text-slate-800 border-slate-200 backdrop-blur-xs'
                      }`}>
                        {member.role}
                      </span>
                    </div>

                    {/* Team Pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/70 text-white backdrop-blur-xs">
                        {member.team}
                      </span>
                    </div>

                    {/* Quick Action buttons (Edit & Delete) */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-md">
                      <button
                        onClick={(e) => handleOpenEditModal(member, e)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="Chỉnh sửa thông tin"
                        aria-label={`Chỉnh sửa ${member.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(member.id, member.name, e)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa thành viên"
                        aria-label={`Xóa ${member.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between gap-1">
                        <h3 className="font-serif-title font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                          {member.name}
                        </h3>
                      </div>
                      
                      {member.nickname && (
                        <div className="text-xs text-sky-700 font-semibold mb-2">
                          Biệt danh: "{member.nickname}"
                        </div>
                      )}

                      <p className="font-serif-title italic text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{member.quote}"
                      </p>
                    </div>

                    {/* Hobbies Pills */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {member.hobbies.slice(0, 2).map((hobby, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-700"
                          >
                            #{hobby}
                          </span>
                        ))}
                        {member.hobbies.length > 2 && (
                          <span className="text-[10px] text-slate-400">
                            +{member.hobbies.length - 2}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>✨ {zodiac.split(' ')[0]}</span>
                        <span className="font-medium text-sky-600 group-hover:underline">
                          Xem hồ sơ ➔
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================
          MODAL 1: Member Profile Detail (Xem hồ sơ chi tiết)
      ======================================================== */}
      {activeProfile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveProfile(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Đóng hồ sơ"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-sky-200 shadow-md flex-shrink-0">
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                    {activeProfile.role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {activeProfile.team}
                  </span>
                </div>
                <h3 className="font-serif-title text-2xl font-bold text-slate-900 truncate">
                  {activeProfile.name}
                </h3>
                <p className="text-xs text-sky-700 font-semibold">
                  Biệt danh: {activeProfile.nickname || 'Chưa cập nhật'}
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 text-center">
              <span className="text-[10px] uppercase font-bold text-sky-600 block mb-1">
                Châm ngôn thanh xuân
              </span>
              <p className="font-serif-title italic text-base text-slate-800">
                "{activeProfile.quote}"
              </p>
            </div>

            {/* Details List */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Ngày sinh & Cung hoàng đạo</span>
                  <span className="font-semibold text-slate-800">
                    {formatVietnameseDate(activeProfile.birthday)} • {activeProfile.zodiac || calculateZodiac(activeProfile.birthday)}
                  </span>
                </div>
              </div>

              {activeProfile.dreamJob && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Ước mơ nghề nghiệp tương lai</span>
                    <span className="font-semibold text-slate-800">{activeProfile.dreamJob}</span>
                  </div>
                </div>
              )}

              {activeProfile.funFact && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Điều thú vị / Kỷ niệm khó quên</span>
                    <span className="font-medium text-slate-700">{activeProfile.funFact}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs text-slate-500 font-semibold block mb-2">Sở thích cá nhân</span>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.hobbies.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions in Profile */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={(e) => {
                  handleOpenEditModal(activeProfile, e);
                  setActiveProfile(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa hồ sơ này</span>
              </button>

              <button
                onClick={() => setActiveProfile(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: Add or Edit Member Form (Thêm/Sửa thành viên)
      ======================================================== */}
      {isEditingModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsEditingModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif-title text-xl font-bold text-slate-900">
                {editingTarget ? 'Chỉnh Sửa Thông Tin Thành Viên' : 'Thêm Thành Viên Mới Vào Lớp 10/12'}
              </h3>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Biệt danh
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Ví dụ: Quân Cận, Linh Kẹo..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chức vụ trong lớp
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Lớp trưởng, Bí thư, Thành viên..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phân bổ Tổ
                  </label>
                  <select
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value as Member['team'] })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                  >
                    <option value="Ban cán sự">Ban cán sự</option>
                    <option value="Tổ 1">Tổ 1</option>
                    <option value="Tổ 2">Tổ 2</option>
                    <option value="Tổ 3">Tổ 3</option>
                    <option value="Tổ 4">Tổ 4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày sinh (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link Ảnh đại diện (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Châm ngôn thanh xuân / Giới thiệu ngắn
                </label>
                <textarea
                  rows={2}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Một câu nói yêu thích của bạn..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sở thích (ngăn cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.hobbies}
                  onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                  placeholder="Bóng rổ, Đọc sách, Đàn guitar..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ước mơ nghề nghiệp
                  </label>
                  <input
                    type="text"
                    value={formData.dreamJob}
                    onChange={(e) => setFormData({ ...formData, dreamJob: e.target.value })}
                    placeholder="Ví dụ: Bác sĩ, Lập trình viên..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Điều thú vị / Kỷ niệm vui
                  </label>
                  <input
                    type="text"
                    value={formData.funFact}
                    onChange={(e) => setFormData({ ...formData, funFact: e.target.value })}
                    placeholder="Thói quen vui hoặc tật xấu đáng yêu..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-md shadow-sky-600/20"
                >
                  {editingTarget ? 'Lưu thay đổi' : 'Thêm vào lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
