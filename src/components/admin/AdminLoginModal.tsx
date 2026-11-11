import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, X, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { AdminUser } from '../../types/scrapbook';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('123456789');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password change mode if forced on initial login
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState('123456789');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(username, password);
      if (res.user.mustChangePassword) {
        setIsChangingPassword(true);
        setCurrentPass(password);
      } else {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Tên đăng nhập hoặc mật khẩu không chính xác';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      await api.changePassword(currentPass, newPass);
      setSuccessNotice('Đổi mật khẩu thành công! Đang chuyển vào trang quản trị...');
      setTimeout(() => {
        onLoginSuccess({ username, mustChangePassword: false });
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi đổi mật khẩu';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#1B1B1B] rounded-3xl border border-[#38342F] p-8 space-y-6 shadow-2xl washi-tape animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#22201E] text-[#A8A29A] hover:text-[#F0EBDD] cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#22201E] border border-[#B9A58A]/50 text-[#B9A58A] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-handwriting text-3xl font-bold text-[#F0EBDD]">
            {isChangingPassword ? 'Đổi Mật Khẩu Khởi Tạo' : 'Đăng Nhập Quản Trị Viên'}
          </h3>
          <p className="text-xs text-[#A8A29A] font-journal">
            {isChangingPassword
              ? 'Vì lý do bảo mật, vui lòng đổi mật khẩu mới cho lần đăng nhập đầu tiên.'
              : 'Dành riêng cho Ban Cán Sự & Quản lý lớp 10/12'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* 1. Login Form */}
        {!isChangingPassword ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans-body">
            <div>
              <label className="block text-[#A8A29A] font-journal text-sm mb-1">
                Tên đăng nhập hoặc Email Quản trị
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A8A29A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin hoặc admin@lop1012.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A8A29A] font-journal text-sm mb-1">
                Mật khẩu (Firebase Auth)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#A8A29A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29A] hover:text-[#F0EBDD] p-1 cursor-pointer"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick credentials hint note */}
            <div className="p-3 rounded-xl bg-[#22201E] border border-[#38342F] text-[11px] text-[#A8A29A] space-y-1">
              <span className="text-[#B9A58A] font-journal text-xs font-semibold block">
                Xác thực bảo mật Firebase Authentication:
              </span>
              <p>Tài khoản: <strong className="text-[#F0EBDD]">Admin</strong> (hoặc <strong className="text-[#F0EBDD]">admin@lop1012.edu.vn</strong>) • Mật khẩu: <strong className="text-[#F0EBDD]">123456789</strong></p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#B9A58A] hover:bg-[#a89376] text-[#111111] font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Đăng Nhập Admin</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* 2. Change Password Form on First Login */
          <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-sans-body">
            <div>
              <label className="block text-[#A8A29A] font-journal text-sm mb-1">
                Mật khẩu mới <span className="text-[#B9A58A]">*</span>
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
              />
            </div>

            <div>
              <label className="block text-[#A8A29A] font-journal text-sm mb-1">
                Xác nhận mật khẩu mới <span className="text-[#B9A58A]">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-2.5 rounded-xl bg-[#22201E] border border-[#38342F] text-sm text-[#F0EBDD] focus:outline-hidden focus:border-[#B9A58A]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#B9A58A] hover:bg-[#a89376] text-[#111111] font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Đang lưu...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Xác Nhận & Tiếp Tục</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
