import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updatePassword,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  deleteDoc, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { 
  ScrapbookStore, 
  ClassInfo, 
  ThemeSettings, 
  LayoutSettings, 
  ScrapbookMember, 
  ScrapbookImage, 
  ScrapbookAlbum, 
  ScrapbookJournal, 
  ScrapbookActivity 
} from '../types/scrapbook';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfigData);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfigData.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, check connection.');
      return false;
    }
    // Document might simply not exist yet, connection is valid
    return true;
  }
}

// Authentication Helpers
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  } else {
    throw new Error('Chưa đăng nhập tài khoản quản trị.');
  }
}

// Firestore Store Operations
export async function getFullStoreFromFirestore(): Promise<ScrapbookStore | null> {
  try {
    // 1. Fetch configurations
    const classInfoSnap = await getDoc(doc(db, 'site_config', 'class_info'));
    const themeSnap = await getDoc(doc(db, 'site_config', 'theme_settings'));
    const layoutSnap = await getDoc(doc(db, 'site_config', 'layout_settings'));

    if (!classInfoSnap.exists()) {
      return null;
    }

    const classInfo = classInfoSnap.data() as ClassInfo;
    const themeSettings = (themeSnap.exists() ? themeSnap.data() : {}) as ThemeSettings;
    const layoutSettings = (layoutSnap.exists() ? layoutSnap.data() : {}) as LayoutSettings;

    // 2. Fetch collections
    const [membersSnap, albumsSnap, gallerySnap, journalsSnap, activitiesSnap] = await Promise.all([
      getDocs(collection(db, 'members')),
      getDocs(collection(db, 'albums')),
      getDocs(collection(db, 'gallery')),
      getDocs(collection(db, 'journals')),
      getDocs(collection(db, 'activities')),
    ]);

    const members: ScrapbookMember[] = membersSnap.docs.map(d => ({ id: d.id, ...d.data() } as ScrapbookMember))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const albums: ScrapbookAlbum[] = albumsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ScrapbookAlbum));

    const gallery: ScrapbookImage[] = gallerySnap.docs.map(d => ({ id: d.id, ...d.data() } as ScrapbookImage))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const journals: ScrapbookJournal[] = journalsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ScrapbookJournal))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const activities: ScrapbookActivity[] = activitiesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ScrapbookActivity))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      classInfo,
      themeSettings,
      layoutSettings,
      members,
      albums,
      gallery,
      journals,
      activities
    };
  } catch (error) {
    console.error('Error fetching store from Firestore:', error);
    return null;
  }
}

// Seed Initial Data to Firestore if empty
export async function seedInitialDataToFirestore(initialStore: ScrapbookStore): Promise<void> {
  const batch = writeBatch(db);

  // 1. Configs
  batch.set(doc(db, 'site_config', 'class_info'), initialStore.classInfo);
  batch.set(doc(db, 'site_config', 'theme_settings'), initialStore.themeSettings);
  batch.set(doc(db, 'site_config', 'layout_settings'), initialStore.layoutSettings);

  // 2. Members
  for (const m of initialStore.members) {
    batch.set(doc(db, 'members', m.id), m);
  }

  // 3. Albums
  for (const a of initialStore.albums) {
    batch.set(doc(db, 'albums', a.id), a);
  }

  // 4. Gallery
  for (const g of initialStore.gallery) {
    batch.set(doc(db, 'gallery', g.id), g);
  }

  // 5. Journals
  for (const j of initialStore.journals) {
    batch.set(doc(db, 'journals', j.id), j);
  }

  // 6. Activities
  for (const act of initialStore.activities) {
    batch.set(doc(db, 'activities', act.id), act);
  }

  await batch.commit();
}

// Granular updates to Firestore
export async function updateClassInfoInFirestore(classInfo: ClassInfo): Promise<void> {
  await setDoc(doc(db, 'site_config', 'class_info'), classInfo);
}

export async function updateThemeSettingsInFirestore(themeSettings: ThemeSettings): Promise<void> {
  await setDoc(doc(db, 'site_config', 'theme_settings'), themeSettings);
}

export async function updateLayoutSettingsInFirestore(layoutSettings: LayoutSettings): Promise<void> {
  await setDoc(doc(db, 'site_config', 'layout_settings'), layoutSettings);
}

export async function saveMemberInFirestore(member: ScrapbookMember): Promise<void> {
  await setDoc(doc(db, 'members', member.id), member);
}

export async function deleteMemberFromFirestore(memberId: string): Promise<void> {
  await deleteDoc(doc(db, 'members', memberId));
}

export async function saveGalleryImageInFirestore(image: ScrapbookImage): Promise<void> {
  await setDoc(doc(db, 'gallery', image.id), image);
}

export async function deleteGalleryImageFromFirestore(imageId: string): Promise<void> {
  await deleteDoc(doc(db, 'gallery', imageId));
}

export async function saveAlbumInFirestore(album: ScrapbookAlbum): Promise<void> {
  await setDoc(doc(db, 'albums', album.id), album);
}

export async function deleteAlbumFromFirestore(albumId: string): Promise<void> {
  await deleteDoc(doc(db, 'albums', albumId));
}

export async function saveJournalInFirestore(journal: ScrapbookJournal): Promise<void> {
  await setDoc(doc(db, 'journals', journal.id), journal);
}

export async function deleteJournalFromFirestore(journalId: string): Promise<void> {
  await deleteDoc(doc(db, 'journals', journalId));
}

export async function saveActivityInFirestore(activity: ScrapbookActivity): Promise<void> {
  await setDoc(doc(db, 'activities', activity.id), activity);
}

export async function deleteActivityFromFirestore(activityId: string): Promise<void> {
  await deleteDoc(doc(db, 'activities', activityId));
}
