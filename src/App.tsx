/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { ScrapbookStore, AdminUser } from './types/scrapbook';
import { PublicNavbar } from './components/public/PublicNavbar';
import { ScrapbookHero } from './components/public/ScrapbookHero';
import { ScrapbookAbout } from './components/public/ScrapbookAbout';
import { ScrapbookMembers } from './components/public/ScrapbookMembers';
import { ScrapbookGallery } from './components/public/ScrapbookGallery';
import { ScrapbookJournal } from './components/public/ScrapbookJournal';
import { ScrapbookActivities } from './components/public/ScrapbookActivities';
import { ScrapbookFooter } from './components/public/ScrapbookFooter';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Lock, Feather, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [store, setStore] = useState<ScrapbookStore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminViewOpen, setIsAdminViewOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Fetch initial content and restore admin session if cookie/token exists
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Load content store
      const data = await api.getContent();
      setStore(data);

      // 2. Check if admin session already exists
      try {
        const meRes = await api.getMe();
        if (meRes.authenticated && meRes.user) {
          setCurrentUser(meRes.user);
        }
      } catch {
        // Not logged in or expired, ignore
      }
    } catch (err: unknown) {
      console.error('Failed to load scrapbook store:', err);
      setError('Không thể kết nối đến máy chủ dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler when admin saves changes in the CMS
  const handleUpdateStore = (updated: ScrapbookStore) => {
    setStore(updated);
  };

  // Handler for admin logout
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout API notice:', err);
    }
    setCurrentUser(null);
    setIsAdminViewOpen(false);
  };

  // Loading Screen (Dark Academia aesthetic)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-[#F0EBDD] p-6">
        <div className="relative flex flex-col items-center gap-6 max-w-sm text-center">
          <div className="relative w-20 h-20 rounded-3xl bg-[#1B1B1B] border-2 border-[#38342F] flex items-center justify-center shadow-2xl">
            <span className="font-handwriting font-bold text-3xl text-[#B9A58A] animate-pulse">
              10/12
            </span>
            <div className="absolute -inset-1 rounded-3xl border border-[#B9A58A]/30 animate-spin -z-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-handwriting text-3xl font-bold text-[#F0EBDD]">
              Đang mở cuốn sổ lưu bút...
            </h2>
            <p className="text-xs text-[#A8A29A] font-journal">
              "Thanh xuân mang tên chúng ta"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error || !store) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-[#F0EBDD] p-6 text-center">
        <div className="max-w-md bg-[#1B1B1B] border border-[#38342F] p-8 rounded-3xl space-y-5 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-[#B9A58A] mx-auto" />
          <h2 className="font-handwriting text-3xl font-bold">Rất tiếc! Có lỗi xảy ra</h2>
          <p className="text-sm text-[#A8A29A]">{error || 'Không tìm thấy dữ liệu lớp học.'}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#B9A58A] text-[#111111] font-semibold text-sm hover:bg-[#a69277] transition-all cursor-pointer shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử kết nối lại</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin CMS Fullscreen View
  if (isAdminViewOpen && currentUser) {
    return (
      <AdminDashboard
        store={store}
        onUpdateStore={handleUpdateStore}
        onLogout={handleLogout}
        onCloseAdmin={() => setIsAdminViewOpen(false)}
      />
    );
  }

  // Public Scrapbook Website View
  const visible = store.layoutSettings?.visibleSections || {
    about: true,
    members: true,
    gallery: true,
    journal: true,
    activities: true,
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#F0EBDD] flex flex-col selection:bg-[#B9A58A]/30 selection:text-[#F0EBDD] relative">
      {/* 1. Public Navbar */}
      <PublicNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => {
          if (currentUser) {
            setIsAdminViewOpen(true);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        isAdminLoggedIn={!!currentUser}
      />

      {/* 2. Main Scrapbook Content */}
      <main className="flex-1 w-full">
        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <ScrapbookHero
              classInfo={store.classInfo}
              onExplore={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewMemories={() => {
                setActiveTab('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* In Home View, show full sections stacked gracefully */}
            {visible.about && (
              <section id="section-about" className="border-t border-[#38342F]/60 pt-4">
                <ScrapbookAbout classInfo={store.classInfo} />
              </section>
            )}

            {visible.members && (
              <section id="section-members" className="border-t border-[#38342F]/60 pt-4">
                <ScrapbookMembers members={store.members} />
              </section>
            )}

            {visible.gallery && (
              <section id="section-gallery" className="border-t border-[#38342F]/60 pt-4">
                <ScrapbookGallery
                  gallery={store.gallery}
                  albums={store.albums}
                  layoutType={store.layoutSettings?.galleryLayout || 'masonry'}
                />
              </section>
            )}

            {visible.journal && (
              <section id="section-journal" className="border-t border-[#38342F]/60 pt-4">
                <ScrapbookJournal journals={store.journals} />
              </section>
            )}

            {visible.activities && (
              <section id="section-activities" className="border-t border-[#38342F]/60 pt-4">
                <ScrapbookActivities activities={store.activities} />
              </section>
            )}
          </div>
        )}

        {/* TAB: ABOUT */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in-50 duration-300">
            <ScrapbookAbout classInfo={store.classInfo} />
          </div>
        )}

        {/* TAB: MEMBERS */}
        {activeTab === 'members' && (
          <div className="animate-in fade-in-50 duration-300">
            <ScrapbookMembers members={store.members} />
          </div>
        )}

        {/* TAB: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="animate-in fade-in-50 duration-300">
            <ScrapbookGallery
              gallery={store.gallery}
              albums={store.albums}
              layoutType={store.layoutSettings?.galleryLayout || 'masonry'}
            />
          </div>
        )}

        {/* TAB: JOURNAL */}
        {activeTab === 'journal' && (
          <div className="animate-in fade-in-50 duration-300">
            <ScrapbookJournal journals={store.journals} />
          </div>
        )}

        {/* TAB: ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="animate-in fade-in-50 duration-300">
            <ScrapbookActivities activities={store.activities} />
          </div>
        )}
      </main>

      {/* 3. Scrapbook Footer */}
      <ScrapbookFooter
        classInfo={store.classInfo}
        onNavClick={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          if (currentUser) {
            setIsAdminViewOpen(true);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        isAdminLoggedIn={!!currentUser}
      />

      {/* 4. Floating Quick Access Badge for Admin */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => {
            if (currentUser) {
              setIsAdminViewOpen(true);
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1B1B1B]/95 backdrop-blur-md border border-[#38342F] text-[#B9A58A] hover:border-[#B9A58A] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer group"
          aria-label="Cổng Quản Trị Viên"
        >
          <Lock className="w-3.5 h-3.5 text-[#B9A58A] group-hover:rotate-12 transition-transform" />
          <span>{currentUser ? 'Quản Trị CMS' : 'Đăng Nhập Admin'}</span>
          {currentUser && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>
      </div>

      {/* 5. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
          setIsAdminViewOpen(true);
        }}
      />
    </div>
  );
}
