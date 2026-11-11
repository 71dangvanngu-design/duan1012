/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HomeHighlights } from './components/HomeHighlights';
import { AboutSection } from './components/AboutSection';
import { MembersSection } from './components/MembersSection';
import { MemoriesSection } from './components/MemoriesSection';
import { GuestbookSection } from './components/GuestbookSection';
import { ScheduleSection } from './components/ScheduleSection';
import { Footer } from './components/Footer';

import { 
  INITIAL_MEMBERS, 
  INITIAL_ALBUMS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_EVENTS, 
  INITIAL_GUESTBOOK_NOTES 
} from './data/mockData';
import { Member, MemoryItem, MemoryNote, Announcement, ClassEvent } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Local storage backed state for members
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('class1012_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_MEMBERS.length) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse error
    }
    return INITIAL_MEMBERS;
  });

  // Local storage backed state for memories
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('class1012_memories_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore parse error
    }
    return INITIAL_ALBUMS;
  });

  // Announcements and events
  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [events] = useState<ClassEvent[]>(INITIAL_EVENTS);

  // Local storage backed state for guestbook notes
  const [guestbookNotes, setGuestbookNotes] = useState<MemoryNote[]>(() => {
    try {
      const saved = localStorage.getItem('class1012_guestbook');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore parse error
    }
    return INITIAL_GUESTBOOK_NOTES;
  });

  // Lightbox selection across tabs
  const [selectedMemoryForLightbox, setSelectedMemoryForLightbox] = useState<MemoryItem | null>(null);
  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('class1012_members', JSON.stringify(members));
    } catch {
      // Ignore quota error
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('class1012_memories_v2', JSON.stringify(memories));
    } catch {
      // Ignore quota error
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('class1012_guestbook', JSON.stringify(guestbookNotes));
    } catch {
      // Ignore quota error
    }
  }, [guestbookNotes]);

  // Handlers for Member mutations
  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [newMember, ...prev]);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Handlers for Memory mutations
  const handleAddMemory = (newItem: MemoryItem) => {
    setMemories((prev) => [newItem, ...prev]);
  };

  const handleLikeMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
    if (selectedMemoryForLightbox && selectedMemoryForLightbox.id === id) {
      setSelectedMemoryForLightbox((prev) =>
        prev ? { ...prev, likes: prev.likes + 1 } : null
      );
    }
  };

  // Handlers for Guestbook mutations
  const handleAddNote = (newNote: MemoryNote) => {
    setGuestbookNotes((prev) => [newNote, ...prev]);
  };

  const handleLikeNote = (id: string) => {
    setGuestbookNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  const handleSelectMemoryFromHome = (item: MemoryItem) => {
    setSelectedMemoryForLightbox(item);
    setActiveTab('memories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans-body selection:bg-sky-200 selection:text-sky-900">
      
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddMemory={() => {
          setIsAddMemoryModalOpen(true);
          setActiveTab('memories');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onExploreClass={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewMemories={() => {
                setActiveTab('memories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              memberCount={members.length}
            />
            <HomeHighlights
              announcements={announcements}
              events={events}
              memories={memories}
              onViewAllEvents={() => {
                setActiveTab('schedule');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewAllMemories={() => {
                setActiveTab('memories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectMemory={handleSelectMemoryFromHome}
            />
          </div>
        )}

        {activeTab === 'about' && <AboutSection />}

        {activeTab === 'members' && (
          <MembersSection
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activeTab === 'memories' && (
          <MemoriesSection
            memories={memories}
            onAddMemory={handleAddMemory}
            onLikeMemory={handleLikeMemory}
            selectedMemoryForLightbox={selectedMemoryForLightbox}
            onCloseLightbox={() => setSelectedMemoryForLightbox(null)}
            isAddMemoryModalOpen={isAddMemoryModalOpen}
            setIsAddMemoryModalOpen={setIsAddMemoryModalOpen}
          />
        )}

        {activeTab === 'guestbook' && (
          <GuestbookSection
            notes={guestbookNotes}
            onAddNote={handleAddNote}
            onLikeNote={handleLikeNote}
          />
        )}

        {activeTab === 'schedule' && <ScheduleSection />}
      </main>

      {/* Footer */}
      <Footer onNavClick={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

    </div>
  );
}
