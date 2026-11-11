import { ScrapbookStore, AdminUser } from '../types/scrapbook';
import { 
  auth, 
  db, 
  getFullStoreFromFirestore, 
  seedInitialDataToFirestore,
  updateClassInfoInFirestore,
  updateThemeSettingsInFirestore,
  updateLayoutSettingsInFirestore,
  loginWithEmail,
  logoutFirebase,
  updateAdminPassword
} from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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
  // Public content fetch: Priority 1: Firestore, Priority 2: Backend server
  async getContent(): Promise<ScrapbookStore> {
    try {
      // 1. Try to fetch from Firestore first
      const firestoreStore = await getFullStoreFromFirestore();
      if (firestoreStore && firestoreStore.classInfo && firestoreStore.members?.length > 0) {
        return firestoreStore;
      }

      // 2. If Firestore is empty, load from backend server
      const res = await fetch('/api/content');
      if (res.ok) {
        const localStore: ScrapbookStore = await res.json();
        // Only seed to Firestore if currently authenticated as Admin
        if (auth.currentUser) {
          try {
            await seedInitialDataToFirestore(localStore);
          } catch (seedErr) {
            console.warn('Seed to Firestore notice:', seedErr);
          }
        }
        return localStore;
      }
    } catch (err) {
      console.warn('Firestore fetch notice, using fallback server data:', err);
    }

    // 3. Fallback to server API
    const res = await fetch('/api/content');
    if (!res.ok) {
      throw new Error('Không thể tải dữ liệu từ máy chủ hoặc Firestore');
    }
    return res.json();
  },

  // Admin content update: updates both Firestore and server persistence
  async updateContent(payload: Partial<ScrapbookStore>): Promise<{ success: boolean; data: ScrapbookStore }> {
    // 1. Update Firestore
    try {
      if (payload.classInfo) {
        await updateClassInfoInFirestore(payload.classInfo);
      }
      if (payload.themeSettings) {
        await updateThemeSettingsInFirestore(payload.themeSettings);
      }
      if (payload.layoutSettings) {
        await updateLayoutSettingsInFirestore(payload.layoutSettings);
      }
      if (payload.members && payload.gallery && payload.albums) {
        await seedInitialDataToFirestore(payload as ScrapbookStore);
      }
    } catch (firestoreErr) {
      console.warn('Direct Firestore write notice:', firestoreErr);
    }

    // 2. Sync to local backend persistence
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

  // Admin Login: Real Firebase Authentication + Backend session
  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; token: string; user: AdminUser }> {
    const email = usernameOrEmail.includes('@') 
      ? usernameOrEmail 
      : `${usernameOrEmail.toLowerCase()}@lop1012.edu.vn`;

    // 1. Try Firebase Authentication
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (fbErr: any) {
      // If user not yet created in this Firebase project, bootstrap/create it
      if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch {
          // If creation fails, proceed to backend verification
        }
      }
    }

    // 2. Authenticate with backend for session token
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Đăng nhập không thành công');
    }

    authStorage.setToken(data.token);

    // 3. Post-login seed if Firestore is empty
    if (auth.currentUser) {
      try {
        const firestoreData = await getFullStoreFromFirestore();
        if (!firestoreData || !firestoreData.classInfo) {
          const contentRes = await fetch('/api/content');
          if (contentRes.ok) {
            const initialData = await contentRes.json();
            await seedInitialDataToFirestore(initialData);
          }
        }
      } catch (seedErr) {
        console.warn('Post-login Firestore seed notice:', seedErr);
      }
    }

    return data;
  },

  // Check current session
  async getMe(): Promise<{ authenticated: boolean; user: AdminUser }> {
    const token = authStorage.getToken();
    const fbUser = auth.currentUser;

    if (!token && !fbUser) {
      return { authenticated: false, user: { username: '', mustChangePassword: false } };
    }

    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (fbUser) {
        return { 
          authenticated: true, 
          user: { username: fbUser.email?.split('@')[0] || 'Admin', mustChangePassword: false } 
        };
      }
      authStorage.clearToken();
      return { authenticated: false, user: { username: '', mustChangePassword: false } };
    }

    return res.json();
  },

  // Change Admin Password: both Firebase Auth and Server
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // 1. Update Firebase Auth password if logged in
    try {
      if (auth.currentUser) {
        await updateAdminPassword(newPassword);
      }
    } catch (fbErr) {
      console.warn('Firebase Auth password update notice:', fbErr);
    }

    // 2. Update Server password hash
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
      await logoutFirebase();
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

    const json = await res.json();
    try {
      await seedInitialDataToFirestore(json.data);
    } catch (fbErr) {
      console.warn('Reset Firestore notice:', fbErr);
    }

    return json;
  },
};
