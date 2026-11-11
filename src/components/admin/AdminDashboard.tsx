import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Image as ImageIcon, 
  FolderPlus, 
  Users, 
  BookOpen, 
  Calendar, 
  Sliders, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Eye,
  KeyRound,
  X
} from 'lucide-react';
import { 
  ScrapbookStore, 
  ScrapbookMember, 
  ScrapbookImage, 
  ScrapbookAlbum, 
  ScrapbookJournal, 
  ScrapbookActivity,
  GalleryLayoutType,
  GallerySpacingType,
  ThemeSettings
} from '../../types/scrapbook';
import { api } from '../../services/api';
import { applyTheme, THEME_PRESETS } from '../../utils/theme';
import { Palette, Type } from 'lucide-react';

interface AdminDashboardProps {
  store: ScrapbookStore;
  onUpdateStore: (updated: ScrapbookStore) => void;
  onLogout: () => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  store,
  onUpdateStore,
  onLogout,
  onCloseAdmin,
}) => {
  // Sidebar active tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Local draft of store being edited
  const [draftStore, setDraftStore] = useState<ScrapbookStore>(() =>
    JSON.parse(JSON.stringify(store))
  );

  // Status banners
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for modals/subforms
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlbum, setNewImageAlbum] = useState(draftStore.albums[0]?.id || '');
  const [newImageFrame, setNewImageFrame] = useState<'polaroid' | 'square' | 'landscape' | 'portrait'>('polaroid');
  const [newImageAspect, setNewImageAspect] = useState<'1:1' | '4:3' | '3:4' | '16:9'>('4:3');

  // Member form state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ScrapbookMember | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    nickname: '',
    role: 'Thành viên',
    avatar: '',
    bio: '',
    birthday: '2009-01-01',
  });

  // Album form state
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');

  // Journal form state
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<ScrapbookJournal | null>(null);
  const [journalForm, setJournalForm] = useState({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
  });

  // Activity form state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ScrapbookActivity | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    category: 'Phong trào',
    date: new Date().toISOString().split('T')[0],
    description: '',
    image: '',
  });

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to persist draft to backend
  const handleSaveToBackend = async (dataToSave = draftStore) => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await api.updateContent(dataToSave);
      onUpdateStore(res.data);
      setStatusMessage({ type: 'success', text: 'Đã lưu thay đổi vào cơ sở dữ liệu thành công!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi lưu dữ liệu';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetDefault = async () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ giao diện và dữ liệu về trạng thái mặc định không?')) {
      setIsSaving(true);
      try {
        const res = await api.resetContent();
        setDraftStore(res.data);
        onUpdateStore(res.data);
        setStatusMessage({ type: 'success', text: 'Đã khôi phục dữ liệu mặc định thành công!' });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Lỗi khi khôi phục dữ liệu';
        setStatusMessage({ type: 'error', text: message });
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Image upload handler (base64)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        try {
          setIsSaving(true);
          const uploadRes = await api.uploadImage(reader.result, file.name);
          setNewImageUrl(uploadRes.url);
          setStatusMessage({ type: 'success', text: 'Tải ảnh lên máy chủ thành công!' });
        } catch {
          // Fallback to data URL if direct upload fails
          setNewImageUrl(reader.result as string);
        } finally {
          setIsSaving(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Image to Gallery
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      alert('Vui lòng chọn hoặc nhập đường dẫn ảnh');
      return;
    }

    const newImg: ScrapbookImage = {
      id: 'img_' + Date.now(),
      title: newImageTitle || 'Kỷ niệm mới',
      caption: newImageCaption,
      url: newImageUrl,
      albumId: newImageAlbum || draftStore.albums[0]?.id || 'alb_1',
      date: new Date().toISOString().split('T')[0],
      frameStyle: newImageFrame,
      aspectRatio: newImageAspect,
      isFeatured: false,
      order: draftStore.gallery.length + 1,
    };

    const updated = {
      ...draftStore,
      gallery: [newImg, ...draftStore.gallery],
    };
    setDraftStore(updated);
    handleSaveToBackend(updated);

    // Reset
    setNewImageTitle('');
    setNewImageCaption('');
    setNewImageUrl('');
    setIsUploadingImage(false);
  };

  // Delete Image
  const handleDeleteImage = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi bộ sưu tập?')) {
      const updated = {
        ...draftStore,
        gallery: draftStore.gallery.filter((g) => g.id !== id),
      };
      setDraftStore(updated);
      handleSaveToBackend(updated);
    }
  };

  // Toggle Featured Image
  const handleToggleFeatured = (id: string) => {
    const updated = {
      ...draftStore,
      gallery: draftStore.gallery.map((g) => (g.id === id ? { ...g, isFeatured: !g.isFeatured } : g)),
    };
    setDraftStore(updated);
    handleSaveToBackend(updated);
  };

  // Member CRUD
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: '',
      nickname: '',
      role: 'Thành viên',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      bio: 'Thanh xuân 10/12 rực rỡ!',
      birthday: '2009-01-01',
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: ScrapbookMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      nickname: member.nickname,
      role: member.role,
      avatar: member.avatar,
      bio: member.bio,
      birthday: member.birthday,
    });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;

    let updatedMembers = [...draftStore.members];
    if (editingMember) {
      updatedMembers = updatedMembers.map((m) =>
        m.id === editingMember.id ? { ...m, ...memberForm } : m
      );
    } else {
      updatedMembers.unshift({
        id: 'm_' + Date.now(),
        ...memberForm,
        order: updatedMembers.length + 1,
      });
    }

    const updated = { ...draftStore, members: updatedMembers };
    setDraftStore(updated);
    handleSaveToBackend(updated);
    setIsMemberModalOpen(false);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên "${name}" khỏi danh sách?`)) {
      const updated = {
        ...draftStore,
        members: draftStore.members.filter((m) => m.id !== id),
      };
      setDraftStore(updated);
      handleSaveToBackend(updated);
    }
  };

  // Album CRUD
  const handleAddAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;

    const newAlbum: ScrapbookAlbum = {
      id: 'alb_' + Date.now(),
      title: albumTitle,
      description: albumDesc,
    };

    const updated = {
      ...draftStore,
      albums: [...draftStore.albums, newAlbum],
    };
    setDraftStore(updated);
    handleSaveToBackend(updated);
    setAlbumTitle('');
    setAlbumDesc('');
    setIsAlbumModalOpen(false);
  };

  const handleDeleteAlbum = (id: string, title: string) => {
    if (confirm(`Xóa album "${title}" và toàn bộ ảnh thuộc album này?`)) {
      const updated = {
        ...draftStore,
        albums: draftStore.albums.filter((a) => a.id !== id),
        gallery: draftStore.gallery.filter((g) => g.albumId !== id),
      };
      setDraftStore(updated);
      handleSaveToBackend(updated);
    }
  };

  // Journal CRUD
  const handleOpenAddJournal = () => {
    setEditingJournal(null);
    setJournalForm({
      title: '',
      content: '',
      author: 'Ban Cán Sự',
      date: new Date().toISOString().split('T')[0],
      image: '',
    });
    setIsJournalModalOpen(true);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalForm.title.trim() || !journalForm.content.trim()) return;

    let updatedJournals = [...draftStore.journals];
    if (editingJournal) {
      updatedJournals = updatedJournals.map((j) =>
        j.id === editingJournal.id ? { ...j, ...journalForm } : j
      );
    } else {
      updatedJournals.unshift({
        id: 'j_' + Date.now(),
        ...journalForm,
      });
    }

    const updated = { ...draftStore, journals: updatedJournals };
    setDraftStore(updated);
    handleSaveToBackend(updated);
    setIsJournalModalOpen(false);
  };

  const handleDeleteJournal = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết nhật ký này?')) {
      const updated = {
        ...draftStore,
        journals: draftStore.journals.filter((j) => j.id !== id),
      };
      setDraftStore(updated);
      handleSaveToBackend(updated);
    }
  };

  // Activity CRUD
  const handleOpenAddActivity = () => {
    setEditingActivity(null);
    setActivityForm({
      title: '',
      category: 'Phong trào',
      date: new Date().toISOString().split('T')[0],
      description: '',
      image: '',
    });
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title.trim()) return;

    let updatedActivities = [...draftStore.activities];
    if (editingActivity) {
      updatedActivities = updatedActivities.map((a) =>
        a.id === editingActivity.id ? { ...a, ...activityForm } : a
      );
    } else {
      updatedActivities.unshift({
        id: 'act_' + Date.now(),
        ...activityForm,
      });
    }

    const updated = { ...draftStore, activities: updatedActivities };
    setDraftStore(updated);
    handleSaveToBackend(updated);
    setIsActivityModalOpen(false);
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa hoạt động này?')) {
      const updated = {
        ...draftStore,
        activities: draftStore.activities.filter((a) => a.id !== id),
      };
      setDraftStore(updated);
      handleSaveToBackend(updated);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);
    if (newPassword.length < 6) {
      setPasswordNotice({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice({ type: 'error', text: 'Mật khẩu xác nhận không trùng khớp' });
      return;
    }

    try {
      await api.changePassword(oldPassword, newPassword);
      setPasswordNotice({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi đổi mật khẩu';
      setPasswordNotice({ type: 'error', text: message });
    }
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'home', label: 'Quản lý trang chủ', icon: Home },
    { id: 'images', label: 'Quản lý hình ảnh', icon: ImageIcon },
    { id: 'albums', label: 'Quản lý album', icon: FolderPlus },
    { id: 'members', label: 'Quản lý thành viên', icon: Users },
    { id: 'journal', label: 'Quản lý bài viết', icon: BookOpen },
    { id: 'activities', label: 'Quản lý hoạt động', icon: Calendar },
    { id: 'layout', label: 'Chỉnh sửa bố cục', icon: Sliders },
    { id: 'settings', label: 'Cài đặt website', icon: Settings },
    { id: 'account', label: 'Quản lý tài khoản', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#F0EBDD] flex flex-col md:flex-row font-sans-body">
      
      {/* -------------------------------------------------------------
          SIDEBAR NAVIGATION
      ------------------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-[#1B1B1B] border-r border-[#38342F] p-5 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          
          {/* Brand & Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#22201E] border border-[#B9A58A] flex items-center justify-center text-[#B9A58A] font-handwriting font-bold text-xl">
                10/12
              </div>
              <div>
                <span className="font-handwriting font-bold text-xl text-[#F0EBDD] block leading-tight">
                  CMS Quản Trị
                </span>
                <span className="text-[10px] text-[#B9A58A] font-journal uppercase tracking-wider">
                  Tập Thể 10/12
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left font-medium ${
                    isActive
                      ? 'bg-[#B9A58A] text-[#111111] font-bold shadow-md'
                      : 'text-[#A8A29A] hover:text-[#F0EBDD] hover:bg-[#22201E]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#111111]' : 'text-[#B9A58A]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Site & Logout */}
        <div className="pt-4 border-t border-[#38342F] space-y-2 text-xs">
          <button
            onClick={onCloseAdmin}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#22201E] hover:bg-[#38342F] text-[#F0EBDD] border border-[#38342F] transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#B9A58A]" />
            <span>Xem website công khai</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Đăng xuất Admin</span>
          </button>
        </div>
      </aside>

      {/* -------------------------------------------------------------
          MAIN CONTENT AREA
      ------------------------------------------------------------- */}
      <main className="flex-1 p-6 sm:p-10 max-h-screen overflow-y-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#38342F]">
          <div>
            <h1 className="font-handwriting text-3xl sm:text-4xl font-bold text-[#F0EBDD]">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#A8A29A]">
              Các thay đổi sẽ được lưu trữ lâu dài trên hệ thống máy chủ và không bị mất khi tải lại trang.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B1B1B] hover:bg-[#22201E] border border-[#38342F] text-xs text-[#A8A29A] hover:text-[#F0EBDD] transition-colors cursor-pointer"
              title="Khôi phục toàn bộ giao diện mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>

            <button
              onClick={() => handleSaveToBackend()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B9A58A] hover:bg-[#a89376] text-[#111111] font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </div>

        {/* Global Status Banner */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/60 border border-rose-800 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 1: TỔNG QUAN (DASHBOARD OVERVIEW)
        ------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-2">
                <span className="text-xs text-[#A8A29A]">Tổng số ảnh</span>
                <p className="font-handwriting text-4xl font-bold text-[#F0EBDD]">{draftStore.gallery.length}</p>
                <span className="text-[10px] text-[#B9A58A]">Trong {draftStore.albums.length} album</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-2">
                <span className="text-xs text-[#A8A29A]">Tổng số thành viên</span>
                <p className="font-handwriting text-4xl font-bold text-[#B9A58A]">{draftStore.members.length}</p>
                <span className="text-[10px] text-[#A8A29A]">Sĩ số chính thức: {draftStore.classInfo.totalMembers}</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-2">
                <span className="text-xs text-[#A8A29A]">Bài viết nhật ký</span>
                <p className="font-handwriting text-4xl font-bold text-[#F0EBDD]">{draftStore.journals.length}</p>
                <span className="text-[10px] text-[#B9A58A]">Trang viết thanh xuân</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-2">
                <span className="text-xs text-[#A8A29A]">Hoạt động & Sự kiện</span>
                <p className="font-handwriting text-4xl font-bold text-[#B9A58A]">{draftStore.activities.length}</p>
                <span className="text-[10px] text-[#A8A29A]">Phong trào, hội trại</span>
              </div>
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => {
                  setActiveTab('images');
                  setIsUploadingImage(true);
                }}
                className="p-6 rounded-2xl bg-[#1B1B1B] hover:bg-[#22201E] border border-[#38342F] text-left transition-colors cursor-pointer space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22201E] border border-[#38342F] flex items-center justify-center text-[#B9A58A]">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="font-handwriting font-bold text-xl text-[#F0EBDD]">Thêm Ảnh Kỷ Niệm Mới</h4>
                <p className="text-xs text-[#A8A29A]">Tải ảnh từ máy tính hoặc dán link ảnh vào thư viện scrapbook.</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab('members');
                  handleOpenAddMember();
                }}
                className="p-6 rounded-2xl bg-[#1B1B1B] hover:bg-[#22201E] border border-[#38342F] text-left transition-colors cursor-pointer space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22201E] border border-[#38342F] flex items-center justify-center text-[#B9A58A]">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-handwriting font-bold text-xl text-[#F0EBDD]">Thêm Thành Viên</h4>
                <p className="text-xs text-[#A8A29A]">Thêm ảnh thẻ Polaroid, biệt danh và câu giới thiệu cho học sinh mới.</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab('layout');
                }}
                className="p-6 rounded-2xl bg-[#1B1B1B] hover:bg-[#22201E] border border-[#38342F] text-left transition-colors cursor-pointer space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22201E] border border-[#38342F] flex items-center justify-center text-[#B9A58A]">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="font-handwriting font-bold text-xl text-[#F0EBDD]">Tùy Chỉnh Bố Cục</h4>
                <p className="text-xs text-[#A8A29A]">Chuyển đổi bố cục Masonry, Polaroid, Grid và ẩn/hiện section.</p>
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: QUẢN LÝ TRANG CHỦ
        ------------------------------------------------------------- */}
        {activeTab === 'home' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-5">
              <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD] border-b border-[#38342F] pb-3">
                Nội Dung Banner Chính (Hero Section)
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Tiêu đề lớn</label>
                  <input
                    type="text"
                    value={draftStore.classInfo.heroTitle}
                    onChange={(e) =>
                      setDraftStore({
                        ...draftStore,
                        classInfo: { ...draftStore.classInfo, heroTitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Dòng giới thiệu ngắn</label>
                  <input
                    type="text"
                    value={draftStore.classInfo.heroSubtitle}
                    onChange={(e) =>
                      setDraftStore({
                        ...draftStore,
                        classInfo: { ...draftStore.classInfo, heroSubtitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Mô tả tập thể lớp</label>
                  <textarea
                    rows={3}
                    value={draftStore.classInfo.heroDescription}
                    onChange={(e) =>
                      setDraftStore({
                        ...draftStore,
                        classInfo: { ...draftStore.classInfo, heroDescription: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Lời nhắn gửi của lớp (khung kẻ giấy)</label>
                  <textarea
                    rows={2}
                    value={draftStore.classInfo.quoteNotice}
                    onChange={(e) =>
                      setDraftStore({
                        ...draftStore,
                        classInfo: { ...draftStore.classInfo, quoteNotice: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Ảnh bìa lớp học (URL hoặc Tải lên)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draftStore.classInfo.coverImage}
                      onChange={(e) =>
                        setDraftStore({
                          ...draftStore,
                          classInfo: { ...draftStore.classInfo, coverImage: e.target.value },
                        })
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs cursor-pointer hover:bg-[#a89376] flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Chọn tệp</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            if (typeof reader.result === 'string') {
                              try {
                                const up = await api.uploadImage(reader.result, file.name);
                                setDraftStore({
                                  ...draftStore,
                                  classInfo: { ...draftStore.classInfo, coverImage: up.url },
                                });
                              } catch {
                                setDraftStore({
                                  ...draftStore,
                                  classInfo: { ...draftStore.classInfo, coverImage: reader.result as string },
                                });
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  {draftStore.classInfo.coverImage && (
                    <div className="mt-3 w-48 h-28 rounded-xl overflow-hidden border border-[#38342F]">
                      <img src={draftStore.classInfo.coverImage} alt="Xem trước" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: QUẢN LÝ HÌNH ẢNH (GALLERY & UPLOAD)
        ------------------------------------------------------------- */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                  Kho Hình Ảnh ({draftStore.gallery.length} ảnh)
                </h3>
                <p className="text-xs text-[#A8A29A]">Quản lý tỷ lệ, khung polaroid, album và chú thích</p>
              </div>

              <button
                onClick={() => setIsUploadingImage(!isUploadingImage)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs cursor-pointer hover:bg-[#a89376]"
              >
                <Plus className="w-4 h-4" />
                <span>{isUploadingImage ? 'Đóng form tải ảnh' : 'Tải ảnh mới'}</span>
              </button>
            </div>

            {/* Upload image form */}
            {isUploadingImage && (
              <form onSubmit={handleAddImage} className="p-6 rounded-3xl bg-[#1B1B1B] border border-[#B9A58A]/50 space-y-4 text-xs">
                <h4 className="font-handwriting text-xl font-bold text-[#F0EBDD]">Thêm ảnh mới vào bộ sưu tập</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Tiêu đề ảnh *</label>
                    <input
                      type="text"
                      required
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      placeholder="Ví dụ: Nắng sân trường 20/11..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Thuộc Album</label>
                    <select
                      value={newImageAlbum}
                      onChange={(e) => setNewImageAlbum(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    >
                      {draftStore.albums.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Kiểu khung hiển thị</label>
                    <select
                      value={newImageFrame}
                      onChange={(e) => setNewImageFrame(e.target.value as ScrapbookImage['frameStyle'])}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    >
                      <option value="polaroid">Khung ảnh Polaroid (Cổ điển)</option>
                      <option value="square">Khung vuông tối giản</option>
                      <option value="landscape">Khung ngang panorama</option>
                      <option value="portrait">Khung dọc chân dung</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Tỷ lệ khung hình</label>
                    <select
                      value={newImageAspect}
                      onChange={(e) => setNewImageAspect(e.target.value as ScrapbookImage['aspectRatio'])}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    >
                      <option value="4:3">Tỷ lệ chuẩn 4:3</option>
                      <option value="1:1">Tỷ lệ vuông 1:1</option>
                      <option value="16:9">Tỷ lệ ngang 16:9</option>
                      <option value="3:4">Tỷ lệ dọc 3:4</option>
                    </select>
                  </div>
                </div>

                {/* Upload or link */}
                <div className="space-y-2">
                  <label className="block text-[#A8A29A] font-semibold">Tải tệp ảnh hoặc nhập link ảnh *</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Dán link ảnh https://..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                    <label className="px-4 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs cursor-pointer flex items-center gap-1.5 hover:bg-[#a89376]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Chọn ảnh từ máy</span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                  </div>

                  {newImageUrl && (
                    <div className="mt-2 w-32 h-24 rounded-xl overflow-hidden border border-[#38342F]">
                      <img src={newImageUrl} alt="Xem trước" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Chú thích dưới ảnh</label>
                  <textarea
                    rows={2}
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    placeholder="Ghi chú kỷ niệm ngắn..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadingImage(false)}
                    className="px-4 py-2 rounded-xl bg-[#22201E] text-[#A8A29A] hover:text-[#F0EBDD]"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold hover:bg-[#a89376]"
                  >
                    Thêm Vào Album
                  </button>
                </div>
              </form>
            )}

            {/* Gallery cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftStore.gallery.map((img) => (
                <div key={img.id} className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#111111] border border-[#38342F] relative">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      {img.isFeatured && (
                        <div className="absolute top-2 left-2 bg-[#B9A58A] text-[#111111] px-2 py-0.5 rounded text-[10px] font-bold">
                          Nổi bật
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-handwriting font-bold text-xl text-[#F0EBDD] truncate">{img.title}</h4>
                      <p className="text-xs text-[#A8A29A] line-clamp-1">{img.caption}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#38342F] flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleFeatured(img.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded-md border ${
                        img.isFeatured ? 'bg-[#B9A58A] text-[#111111] border-[#B9A58A]' : 'bg-[#22201E] text-[#A8A29A] border-[#38342F]'
                      }`}
                    >
                      {img.isFeatured ? '★ Đang nổi bật' : '☆ Đặt nổi bật'}
                    </button>

                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: QUẢN LÝ ALBUM
        ------------------------------------------------------------- */}
        {activeTab === 'albums' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                  Danh Sách Album ({draftStore.albums.length})
                </h3>
                <p className="text-xs text-[#A8A29A]">Phân loại sự kiện và các đợt lưu niệm</p>
              </div>

              <button
                onClick={() => setIsAlbumModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs hover:bg-[#a89376]"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Album Mới</span>
              </button>
            </div>

            {isAlbumModalOpen && (
              <form onSubmit={handleAddAlbum} className="p-6 rounded-3xl bg-[#1B1B1B] border border-[#B9A58A]/50 space-y-4 text-xs">
                <h4 className="font-handwriting text-xl font-bold text-[#F0EBDD]">Tạo Album Kỷ Niệm</h4>
                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Tên Album *</label>
                  <input
                    type="text"
                    required
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    placeholder="Ví dụ: Hội trại mùa xuân..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Mô tả ngắn</label>
                  <textarea
                    rows={2}
                    value={albumDesc}
                    onChange={(e) => setAlbumDesc(e.target.value)}
                    placeholder="Mô tả sự kiện..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAlbumModalOpen(false)} className="px-4 py-2 rounded-xl bg-[#22201E] text-[#A8A29A]">
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold">
                    Tạo Album
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {draftStore.albums.map((alb) => {
                const count = draftStore.gallery.filter((g) => g.albumId === alb.id).length;
                return (
                  <div key={alb.id} className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#38342F] flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-handwriting font-bold text-xl text-[#F0EBDD]">{alb.title}</h4>
                      <p className="text-xs text-[#A8A29A]">{alb.description || 'Chưa có mô tả'}</p>
                      <span className="text-[10px] text-[#B9A58A] font-journal">{count} bức ảnh</span>
                    </div>

                    <button
                      onClick={() => handleDeleteAlbum(alb.id, alb.title)}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/50"
                      title="Xóa album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: QUẢN LÝ THÀNH VIÊN
        ------------------------------------------------------------- */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                  Danh Sách Thành Viên Lớp ({draftStore.members.length} bạn)
                </h3>
                <p className="text-xs text-[#A8A29A]">Thêm, chỉnh sửa ảnh thẻ, biệt danh và vai trò trong lớp</p>
              </div>

              <button
                onClick={handleOpenAddMember}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs hover:bg-[#a89376]"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Thành Viên Mới</span>
              </button>
            </div>

            {/* Member Form Modal */}
            {isMemberModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <form
                  onSubmit={handleSaveMember}
                  className="w-full max-w-md bg-[#1B1B1B] border border-[#38342F] rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#38342F]">
                    <h4 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                      {editingMember ? 'Sửa Thông Tin Thành Viên' : 'Thêm Thành Viên Mới'}
                    </h4>
                    <button type="button" onClick={() => setIsMemberModalOpen(false)}>
                      <X className="w-5 h-5 text-[#A8A29A]" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#A8A29A] mb-1 font-semibold">Biệt danh</label>
                      <input
                        type="text"
                        value={memberForm.nickname}
                        onChange={(e) => setMemberForm({ ...memberForm, nickname: e.target.value })}
                        placeholder="Quân Cận..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29A] mb-1 font-semibold">Vai trò</label>
                      <input
                        type="text"
                        value={memberForm.role}
                        onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                        placeholder="Lớp trưởng, Bí thư..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Ảnh đại diện (URL)</label>
                    <input
                      type="url"
                      value={memberForm.avatar}
                      onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Câu giới thiệu ngắn / Châm ngôn</label>
                    <textarea
                      rows={2}
                      value={memberForm.bio}
                      onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                      placeholder="Một câu nói vui hoặc triết lý..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-[#38342F]">
                    <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-4 py-2 rounded-xl bg-[#22201E] text-[#A8A29A]">
                      Hủy
                    </button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold">
                      Lưu Thành Viên
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Members table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftStore.members.map((mem) => (
                <div key={mem.id} className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#38342F] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={mem.avatar} alt={mem.name} className="w-12 h-12 rounded-xl object-cover border border-[#38342F]" />
                    <div className="min-w-0">
                      <h4 className="font-handwriting font-bold text-lg text-[#F0EBDD] truncate">{mem.name}</h4>
                      <p className="text-[11px] text-[#B9A58A] truncate">{mem.role} • "{mem.nickname}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditMember(mem)}
                      className="p-1.5 rounded-lg text-[#A8A29A] hover:text-[#F0EBDD]"
                      title="Chỉnh sửa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(mem.id, mem.name)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 6: QUẢN LÝ BÀI VIẾT (NHẬT KÝ THANH XUÂN)
        ------------------------------------------------------------- */}
        {activeTab === 'journal' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                  Nhật Ký Thanh Xuân ({draftStore.journals.length} bài)
                </h3>
                <p className="text-xs text-[#A8A29A]">Những trang viết ghi chép cảm xúc và câu chuyện của lớp</p>
              </div>

              <button
                onClick={handleOpenAddJournal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs hover:bg-[#a89376]"
              >
                <Plus className="w-4 h-4" />
                <span>Viết Nhật Ký Mới</span>
              </button>
            </div>

            {/* Journal Modal */}
            {isJournalModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <form
                  onSubmit={handleSaveJournal}
                  className="w-full max-w-lg bg-[#1B1B1B] border border-[#38342F] rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#38342F]">
                    <h4 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                      {editingJournal ? 'Sửa Bài Viết' : 'Trang Nhật Ký Mới'}
                    </h4>
                    <button type="button" onClick={() => setIsJournalModalOpen(false)}>
                      <X className="w-5 h-5 text-[#A8A29A]" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Tiêu đề bài viết *</label>
                    <input
                      type="text"
                      required
                      value={journalForm.title}
                      onChange={(e) => setJournalForm({ ...journalForm, title: e.target.value })}
                      placeholder="Một buổi chiều mưa rơi..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#A8A29A] mb-1 font-semibold">Người chắp bút</label>
                      <input
                        type="text"
                        value={journalForm.author}
                        onChange={(e) => setJournalForm({ ...journalForm, author: e.target.value })}
                        placeholder="Châu Miu..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29A] mb-1 font-semibold">Ngày đăng</label>
                      <input
                        type="date"
                        value={journalForm.date}
                        onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Nội dung trang nhật ký *</label>
                    <textarea
                      rows={5}
                      required
                      value={journalForm.content}
                      onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                      placeholder="Viết những suy nghĩ, câu chuyện ấm áp của lớp..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Link ảnh minh họa đính kèm</label>
                    <input
                      type="url"
                      value={journalForm.image}
                      onChange={(e) => setJournalForm({ ...journalForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-[#38342F]">
                    <button type="button" onClick={() => setIsJournalModalOpen(false)} className="px-4 py-2 rounded-xl bg-[#22201E] text-[#A8A29A]">
                      Hủy
                    </button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold">
                      Lưu Bài Viết
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {draftStore.journals.map((j) => (
                <div key={j.id} className="p-5 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#B9A58A] font-journal">{j.date} • {j.author || 'Tập thể'}</span>
                    <button onClick={() => handleDeleteJournal(j.id)} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-handwriting font-bold text-2xl text-[#F0EBDD]">{j.title}</h4>
                  <p className="text-xs text-[#A8A29A] line-clamp-2 leading-relaxed">{j.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 7: QUẢN LÝ HOẠT ĐỘNG
        ------------------------------------------------------------- */}
        {activeTab === 'activities' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                  Hoạt Động & Phong Trào ({draftStore.activities.length})
                </h3>
                <p className="text-xs text-[#A8A29A]">Lưu giữ các sự kiện ngoại khóa, văn nghệ, thể thao</p>
              </div>

              <button
                onClick={handleOpenAddActivity}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs hover:bg-[#a89376]"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Hoạt Động</span>
              </button>
            </div>

            {isActivityModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <form
                  onSubmit={handleSaveActivity}
                  className="w-full max-w-lg bg-[#1B1B1B] border border-[#38342F] rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#38342F]">
                    <h4 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">Thêm Hoạt Động Mới</h4>
                    <button type="button" onClick={() => setIsActivityModalOpen(false)}>
                      <X className="w-5 h-5 text-[#A8A29A]" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Tên sự kiện *</label>
                    <input
                      type="text"
                      required
                      value={activityForm.title}
                      onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                      placeholder="Hội trại 26/3..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#A8A29A] mb-1 font-semibold">Thể loại</label>
                      <input
                        type="text"
                        value={activityForm.category}
                        onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                        placeholder="Phong trào, Thể thao..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29A] mb-1 font-semibold">Ngày diễn ra</label>
                      <input
                        type="date"
                        value={activityForm.date}
                        onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Mô tả sự kiện</label>
                    <textarea
                      rows={3}
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      placeholder="Mô tả diễn biến, kết quả đạt được..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A8A29A] mb-1 font-semibold">Link ảnh hoạt động</label>
                    <input
                      type="url"
                      value={activityForm.image}
                      onChange={(e) => setActivityForm({ ...activityForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-[#38342F]">
                    <button type="button" onClick={() => setIsActivityModalOpen(false)} className="px-4 py-2 rounded-xl bg-[#22201E] text-[#A8A29A]">
                      Hủy
                    </button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-[#B9A58A] text-[#111111] font-bold">
                      Lưu Hoạt Động
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftStore.activities.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#A8A29A]">
                    <span className="text-[#B9A58A] font-semibold">{a.category} • {a.date}</span>
                    <button onClick={() => handleDeleteActivity(a.id)} className="text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-handwriting font-bold text-xl text-[#F0EBDD]">{a.title}</h4>
                  <p className="text-xs text-[#A8A29A] line-clamp-2">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 8: CHỈNH SỬA BỐ CỤC & GIAO DIỆN
        ------------------------------------------------------------- */}
        {activeTab === 'layout' && (
          <div className="space-y-8 max-w-4xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-6">
              <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD] border-b border-[#38342F] pb-3">
                Cài Đặt Bố Cục Thư Viện Ảnh (Gallery Layout)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'masonry', label: 'Bố cục Masonry', desc: 'Lưới so le tự nhiên' },
                  { id: 'polaroid', label: 'Bố cục Polaroid', desc: 'Thẻ ảnh nghiêng nhẹ' },
                  { id: 'grid', label: 'Lưới Cân Đối (Grid)', desc: 'Các ô bằng nhau' },
                  { id: 'list', label: 'Danh Sách Dọc', desc: 'Tập trung từng ảnh' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setDraftStore({
                        ...draftStore,
                        layoutSettings: {
                          ...draftStore.layoutSettings,
                          galleryLayout: opt.id as GalleryLayoutType,
                        },
                      })
                    }
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      draftStore.layoutSettings.galleryLayout === opt.id
                        ? 'bg-[#22201E] border-[#B9A58A] text-[#F0EBDD] shadow-md'
                        : 'bg-[#111111] border-[#38342F] text-[#A8A29A] hover:border-[#B9A58A]/50'
                    }`}
                  >
                    <span className="font-handwriting text-lg font-bold block text-[#F0EBDD]">{opt.label}</span>
                    <span className="text-[10px] text-[#A8A29A] block mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>

              {/* Section Visibility toggles */}
              <div className="pt-4 border-t border-[#38342F] space-y-3">
                <span className="block text-sm font-semibold text-[#F0EBDD]">Ẩn / Hiện các phân mục trên trang</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: 'hero', label: 'Banner Trang Chủ' },
                    { key: 'notes', label: 'Khung Lời Nhắn Vở Kẻ' },
                    { key: 'about', label: 'Giới Thiệu & GVCN' },
                    { key: 'members', label: 'Danh Sách Thành Viên' },
                    { key: 'gallery', label: 'Thư Viện Ảnh Scrapbook' },
                    { key: 'journal', label: 'Nhật Ký Thanh Xuân' },
                    { key: 'activities', label: 'Hoạt Động & Phong Trào' },
                  ].map((sec) => (
                    <label
                      key={sec.key}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#22201E] border border-[#38342F] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={draftStore.layoutSettings.visibleSections[sec.key] !== false}
                        onChange={(e) => {
                          setDraftStore({
                            ...draftStore,
                            layoutSettings: {
                              ...draftStore.layoutSettings,
                              visibleSections: {
                                ...draftStore.layoutSettings.visibleSections,
                                [sec.key]: e.target.checked,
                              },
                            },
                          });
                        }}
                        className="rounded-sm text-[#B9A58A] focus:ring-[#B9A58A]"
                      />
                      <span className="text-xs text-[#F0EBDD]">{sec.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 9: CÀI ĐẶT WEBSITE
        ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-4 text-xs">
              <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD] border-b border-[#38342F] pb-3">
                Thông Tin Tập Thể & Trường Học
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Tên lớp</label>
                  <input
                    type="text"
                    value={draftStore.classInfo.name}
                    onChange={(e) =>
                      setDraftStore({
                        ...draftStore,
                        classInfo: { ...draftStore.classInfo, name: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Niên khóa</label>
                  <input
                    type="text"
                    value={draftStore.classInfo.academicYear}
                    onChange={(e) =>
                      setDraftStore({
                        ...draftStore,
                        classInfo: { ...draftStore.classInfo, academicYear: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A8A29A] mb-1 font-semibold">Trường học</label>
                <input
                  type="text"
                  value={draftStore.classInfo.school}
                  onChange={(e) =>
                    setDraftStore({
                      ...draftStore,
                      classInfo: { ...draftStore.classInfo, school: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29A] mb-1 font-semibold">Khẩu hiệu / Slogan chính</label>
                <input
                  type="text"
                  value={draftStore.classInfo.slogan}
                  onChange={(e) =>
                    setDraftStore({
                      ...draftStore,
                      classInfo: { ...draftStore.classInfo, slogan: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD]"
                />
              </div>

              <div className="pt-2 border-t border-[#38342F]">
                <h4 className="font-semibold text-sm text-[#F0EBDD] mb-3">Thông Tin Giáo Viên Chủ Nhiệm</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A8A29A] mb-1">Tên giáo viên</label>
                    <input
                      type="text"
                      value={draftStore.classInfo.headTeacher.name}
                      onChange={(e) =>
                        setDraftStore({
                          ...draftStore,
                          classInfo: {
                            ...draftStore.classInfo,
                            headTeacher: { ...draftStore.classInfo.headTeacher, name: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8A29A] mb-1">Bộ môn giảng dạy</label>
                    <input
                      type="text"
                      value={draftStore.classInfo.headTeacher.subject}
                      onChange={(e) =>
                        setDraftStore({
                          ...draftStore,
                          classInfo: {
                            ...draftStore.classInfo,
                            headTeacher: { ...draftStore.classInfo.headTeacher, subject: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Theme, Font & Color Customizer */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-6 text-xs">
              <div className="flex items-center gap-2 border-b border-[#38342F] pb-3">
                <Palette className="w-5 h-5 text-[#B9A58A]" />
                <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                  Tùy Biến Giao Diện, Màu Sắc & Font Chữ (Live Customizer)
                </h3>
              </div>

              {/* Theme Presets */}
              <div className="space-y-3">
                <label className="block text-[#A8A29A] font-semibold text-sm">
                  Gói Giao Diện Mẫu (Presets)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'dark-academia', label: 'Dark Academia', desc: 'Cổ điển, trầm ấm', bg: '#111111', accent: '#B9A58A' },
                    { id: 'sepia-vintage', label: 'Sepia Vintage', desc: 'Giấy báo hoài niệm', bg: '#181512', accent: '#C69766' },
                    { id: 'midnight-scholar', label: 'Midnight Scholar', desc: 'Bầu trời đêm sâu thẳm', bg: '#0D1117', accent: '#79C0FF' },
                    { id: 'forest-notebook', label: 'Forest Notebook', desc: 'Sổ tay xanh rừng', bg: '#0F1715', accent: '#7EB693' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        const presetData = THEME_PRESETS[preset.id];
                        if (presetData) {
                          const updated: ThemeSettings = {
                            ...(draftStore.themeSettings || {}),
                            ...presetData,
                            themePreset: preset.id as any,
                          } as ThemeSettings;
                          setDraftStore({
                            ...draftStore,
                            themeSettings: updated,
                          });
                          applyTheme(updated);
                        }
                      }}
                      className="p-3 rounded-2xl border text-left transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
                      style={{
                        backgroundColor: preset.bg,
                        borderColor: draftStore.themeSettings?.themePreset === preset.id ? preset.accent : '#38342F',
                        borderWidth: draftStore.themeSettings?.themePreset === preset.id ? '2px' : '1px',
                      }}
                    >
                      <div>
                        <span className="font-bold text-[#F0EBDD] block">{preset.label}</span>
                        <span className="text-[10px] text-[#A8A29A]">{preset.desc}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                        <span className="text-[10px]" style={{ color: preset.accent }}>Áp dụng</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Sizing */}
              <div className="space-y-3 pt-3 border-t border-[#38342F]">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#B9A58A]" />
                  <label className="text-[#A8A29A] font-semibold text-sm">
                    Kích Thước Chữ Toàn Trang
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'sm', label: 'Nhỏ (14px)', desc: 'Gọn gàng' },
                    { id: 'base', label: 'Chuẩn (16px)', desc: 'Mặc định cân đối' },
                    { id: 'lg', label: 'Lớn (18px)', desc: 'Dễ đọc, nổi bật' },
                  ].map((sizeOpt) => {
                    const currentSize = draftStore.themeSettings?.fontSize || 'base';
                    const isSelected = currentSize === sizeOpt.id;
                    return (
                      <button
                        key={sizeOpt.id}
                        type="button"
                        onClick={() => {
                          const updated: ThemeSettings = {
                            ...(draftStore.themeSettings || {}),
                            fontSize: sizeOpt.id as any,
                          } as ThemeSettings;
                          setDraftStore({
                            ...draftStore,
                            themeSettings: updated,
                          });
                          applyTheme(updated);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#B9A58A] text-[#111111] font-bold border-[#B9A58A]'
                            : 'bg-[#22201E] text-[#A8A29A] border-[#38342F] hover:text-[#F0EBDD]'
                        }`}
                      >
                        <div className="text-xs">{sizeOpt.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Heading Font Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#38342F]">
                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Font Tiêu Đề</label>
                  <select
                    value={draftStore.themeSettings?.headingFont || "'Caveat', cursive, sans-serif"}
                    onChange={(e) => {
                      const updated: ThemeSettings = {
                        ...(draftStore.themeSettings || {}),
                        headingFont: e.target.value,
                      } as ThemeSettings;
                      setDraftStore({
                        ...draftStore,
                        themeSettings: updated,
                      });
                      applyTheme(updated);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] cursor-pointer"
                  >
                    <option value="'Caveat', cursive, sans-serif">Caveat (Chữ viết tay bay bổng)</option>
                    <option value="'Patrick Hand', cursive, sans-serif">Patrick Hand (Chữ viết tay nhật ký)</option>
                    <option value="'Playfair Display', serif, sans-serif">Playfair Display (Chữ in cổ điển)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Font Nội Dung</label>
                  <select
                    value={draftStore.themeSettings?.bodyFont || "'Nunito', 'Be Vietnam Pro', sans-serif"}
                    onChange={(e) => {
                      const updated: ThemeSettings = {
                        ...(draftStore.themeSettings || {}),
                        bodyFont: e.target.value,
                      } as ThemeSettings;
                      setDraftStore({
                        ...draftStore,
                        themeSettings: updated,
                      });
                      applyTheme(updated);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-xs text-[#F0EBDD] cursor-pointer"
                  >
                    <option value="'Nunito', 'Be Vietnam Pro', system-ui, sans-serif">Nunito (Thân thiện, ấm áp)</option>
                    <option value="'Be Vietnam Pro', sans-serif">Be Vietnam Pro (Trang nhã hiện đại)</option>
                  </select>
                </div>
              </div>

              {/* Color Customizers */}
              <div className="pt-3 border-t border-[#38342F] space-y-3">
                <label className="block text-[#A8A29A] font-semibold text-sm">
                  Tùy Biến Bảng Màu Chi Tiết
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'mainBg', label: 'Nền chính' },
                    { key: 'secondaryBg', label: 'Nền phụ' },
                    { key: 'textPrimary', label: 'Chữ chính' },
                    { key: 'textSecondary', label: 'Chữ phụ' },
                    { key: 'accentColor', label: 'Màu nhấn' },
                    { key: 'borderColor', label: 'Màu viền' },
                  ].map((colorItem) => {
                    const colorVal = (draftStore.themeSettings as any)?.[colorItem.key] || '#111111';
                    return (
                      <div key={colorItem.key} className="p-2.5 rounded-xl bg-[#22201E] border border-[#38342F] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#A8A29A]">{colorItem.label}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorVal.startsWith('#') && colorVal.length === 7 ? colorVal : '#111111'}
                            onChange={(e) => {
                              const updated: ThemeSettings = {
                                ...(draftStore.themeSettings || {}),
                                [colorItem.key]: e.target.value,
                              } as ThemeSettings;
                              setDraftStore({
                                ...draftStore,
                                themeSettings: updated,
                              });
                              applyTheme(updated);
                            }}
                            className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <span className="text-[10px] font-mono text-[#F0EBDD]">{colorVal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 10: QUẢN LÝ TÀI KHOẢN ADMIN (CHANGE PASSWORD)
        ------------------------------------------------------------- */}
        {activeTab === 'account' && (
          <div className="space-y-6 max-w-md">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-4 text-xs">
              <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD] border-b border-[#38342F] pb-3">
                Đổi Mật Khẩu Quản Trị Viên
              </h3>

              {passwordNotice && (
                <div
                  className={`p-3 rounded-xl ${
                    passwordNotice.type === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                      : 'bg-rose-950/60 border border-rose-800 text-rose-200'
                  }`}
                >
                  {passwordNotice.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29A] mb-1 font-semibold">Nhập lại mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#B9A58A] hover:bg-[#a89376] text-[#111111] font-bold text-xs cursor-pointer shadow-md mt-2"
                >
                  Cập Nhật Mật Khẩu
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
