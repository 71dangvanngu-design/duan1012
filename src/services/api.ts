import { ScrapbookStore, AdminUser } from '../types/scrapbook';

const TOKEN_KEY = 'admin_session_token';

export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Ignore
    }
  },
  clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore
    }
  },
};

function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Public content fetch
  async getContent(): Promise<ScrapbookStore> {
    const res = await fetch('/api/content');
    if (!res.ok) {
      throw new Error('Không thể tải dữ liệu từ máy chủ');
    }
    return res.json();
  },

  // Admin content update
  async updateContent(payload: Partial<ScrapbookStore>): Promise<{ success: boolean; data: ScrapbookStore }> {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi cập nhật nội dung');
    }
    return res.json();
  },

  // Admin Login
  async login(username: string, password: string): Promise<{ success: boolean; token: string; user: AdminUser }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Đăng nhập không thành công');
    }
    authStorage.setToken(data.token);
    return data;
  },

  // Check current session
  async getMe(): Promise<{ authenticated: boolean; user: AdminUser }> {
    const token = authStorage.getToken();
    if (!token) {
      return { authenticated: false, user: { username: '', mustChangePassword: false } };
    }
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      authStorage.clearToken();
      return { authenticated: false, user: { username: '', mustChangePassword: false } };
    }
    return res.json();
  },

  // Change Admin Password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Không thể đổi mật khẩu');
    }
    return data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // Ignore network error on logout
    } finally {
      authStorage.clearToken();
    }
  },

  // Upload image (base64)
  async uploadImage(dataUrl: string, filename?: string): Promise<{ success: boolean; url: string }> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ dataUrl, filename }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Tải ảnh lên thất bại');
    }
    return data;
  },

  // Reset to default
  async resetContent(): Promise<{ success: boolean; data: ScrapbookStore }> {
    const res = await fetch('/api/content/reset', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Không thể khôi phục dữ liệu mặc định');
    }
    return res.json();
  },
};
