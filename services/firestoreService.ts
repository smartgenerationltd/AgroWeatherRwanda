import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, Farm, Crop, FarmingTask, Conversation, Alert, UserRole } from '../types';

// Default initial demo seed data for Rwandan farmers
export const DEMO_USER: UserProfile = {
  uid: 'demo-farmer-rwanda-001',
  fullName: 'Gilbert Niyomugabo',
  email: 'giniyomugabo@gmail.com',
  phone: '+250 788 123 456',
  role: UserRole.Farmer,
  preferredLanguage: 'rw',
  province: 'Northern',
  district: 'Musanze',
  sector: 'Kinigi',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDemo: true
};

export const INITIAL_DEMO_FARMS: Farm[] = [
  {
    id: 'farm-01',
    ownerId: 'demo-farmer-rwanda-001',
    farmName: 'Umurima w\'Ibirayi wa Kinigi (Volcanic Farm)',
    province: 'Northern',
    district: 'Musanze',
    sector: 'Kinigi',
    village: 'Bisoke Valley',
    latitude: -1.4589,
    longitude: 29.5892,
    altitudeMeters: 2250,
    farmSizeHectares: 1.8,
    soilType: 'Andosols (Volcanic Rich)',
    irrigationType: 'Rainfed',
    terraced: true,
    agroEcoZone: 'volcanic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'farm-02',
    ownerId: 'demo-farmer-rwanda-001',
    farmName: 'Umurima w\'Ibigori n\'Ibishyimbo wa Busogo',
    province: 'Northern',
    district: 'Musanze',
    sector: 'Busogo',
    village: 'Gisesero',
    latitude: -1.5540,
    longitude: 29.5420,
    altitudeMeters: 1950,
    farmSizeHectares: 2.4,
    soilType: 'Volcanic Loam',
    irrigationType: 'Drip/Sprinkler',
    terraced: true,
    agroEcoZone: 'volcanic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_DEMO_CROPS: Crop[] = [
  {
    id: 'crop-01',
    farmId: 'farm-01',
    ownerId: 'demo-farmer-rwanda-001',
    cropType: 'Irish Potatoes (Ibirayi)',
    cropNameRw: 'Ibirayi bya Kinigi',
    variety: 'Kinigi Super Seed (RAB Certified)',
    season: 'Season A',
    plantingDate: '2026-08-15',
    expectedHarvestDate: '2026-11-25',
    growthStage: 'Vegetative',
    acreage: 1.2,
    healthStatus: 'Excellent',
    targetYieldKg: 24000,
    waterNeed: 'Moderate',
    notes: 'Kugenzura umusonga (Late Blight) hakiri kare kubera igihu cyo mu birunga.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'crop-02',
    farmId: 'farm-02',
    ownerId: 'demo-farmer-rwanda-001',
    cropType: 'Climbing Beans (Ibishyimbo by\'Imitego)',
    cropNameRw: 'Ibishyimbo bya RWV 1129',
    variety: 'RWV 1129 (High-Yield Biofortified)',
    season: 'Season A',
    plantingDate: '2026-08-20',
    expectedHarvestDate: '2026-12-05',
    growthStage: 'Germination',
    acreage: 0.8,
    healthStatus: 'Good',
    targetYieldKg: 2800,
    waterNeed: 'High',
    notes: 'Gushyiramo imitego y\'imishingo y\'urubingo mu cyumweru gitaha.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'crop-03',
    farmId: 'farm-02',
    ownerId: 'demo-farmer-rwanda-001',
    cropType: 'Hybrid Maize (Ibigori)',
    cropNameRw: 'Ibigori bya RHM 104',
    variety: 'RHM 104 High Altitude Hybrid',
    season: 'Season A',
    plantingDate: '2026-08-10',
    expectedHarvestDate: '2027-01-15',
    growthStage: 'Vegetative',
    acreage: 1.5,
    healthStatus: 'Good',
    targetYieldKg: 6500,
    waterNeed: 'Moderate',
    notes: 'Gushyira ifumbire yo hejuru ya UREA umunsi izuba rirabagirana.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_DEMO_TASKS: FarmingTask[] = [
  {
    id: 'task-01',
    ownerId: 'demo-farmer-rwanda-001',
    farmId: 'farm-01',
    cropId: 'crop-01',
    cropName: 'Ibirayi bya Kinigi',
    title: 'Preventative Fungicide Application (Late Blight)',
    titleRw: 'Gutera Umuti wo Kurinda Umusonga w\'Ibirayi (Mancozeb)',
    description: 'Spray contact fungicide before prolonged misty afternoon rains build up in the volcanic zone.',
    descriptionRw: 'Tera umuti wa Mancozeb mu gitondo cya kare (7:00 AM) mbere y\'uko igihu n\'imvura byisukiranya.',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Spraying',
    priority: 'urgent',
    status: 'pending',
    weatherSuitability: 'optimal',
    weatherReason: 'Wind speed is low (6 km/h) with clear morning window.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-02',
    ownerId: 'demo-farmer-rwanda-001',
    farmId: 'farm-02',
    cropId: 'crop-03',
    cropName: 'Ibigori bya RHM 104',
    title: 'Top-Dressing Urea Fertilizer Application',
    titleRw: 'Gushyiramo Ifumbire yo hejuru ya UREA mu Bigori',
    description: 'Apply top-dressing urea 5cm around plant root base and cover with soil.',
    descriptionRw: 'Shyiramo ifumbire ya UREA ku muzi w\'ikigori uyitabire hasi ngo itayuka ku zuba.',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    category: 'Fertilizer',
    priority: 'high',
    status: 'pending',
    weatherSuitability: 'optimal',
    weatherReason: 'Soil is moist; moderate temperature expected.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-03',
    ownerId: 'demo-farmer-rwanda-001',
    farmId: 'farm-02',
    cropId: 'crop-02',
    cropName: 'Ibishyimbo bya RWV 1129',
    title: 'Staking Climbing Beans with Bamboo Sticks',
    titleRw: 'Gushinga Imitego mu Bishyimbo by\'Imishingo',
    description: 'Install climbing sticks/trellis to maximize vertical bean canopy.',
    descriptionRw: 'Shinga ibiti by\'imitego bifite uburebure bwa metero 2 kugira ngo ibishyimbo birande neza.',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    category: 'General',
    priority: 'medium',
    status: 'pending',
    weatherSuitability: 'optimal',
    weatherReason: 'Sunny conditions suitable for manual field labor.',
    createdAt: new Date().toISOString()
  }
];

// Local Storage helpers for fallback persistence
const getLocal = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(`agroweather_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocal = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(`agroweather_${key}`, JSON.stringify(val));
  } catch (err) {
    console.warn("Local storage write error:", err);
  }
};

// ================= USER PROFILE =================
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    if (db) {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    }
  } catch (err) {
    console.warn("Firestore getUserProfile notice, checking local cache:", err);
  }

  const localUser = getLocal<UserProfile | null>('currentUser', null);
  if (localUser && localUser.uid === uid) return localUser;
  if (uid === DEMO_USER.uid) return DEMO_USER;
  return null;
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    if (db) {
      const userRef = doc(db, 'users', profile.uid);
      await setDoc(userRef, profile, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore saveUserProfile error, saving to local cache:", err);
  }
  setLocal('currentUser', profile);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    if (db) {
      const usersCol = collection(db, 'users');
      const snap = await getDocs(usersCol);
      if (!snap.empty) {
        return snap.docs.map(d => d.data() as UserProfile);
      }
    }
  } catch (err) {
    console.warn("Firestore getAllUsers error:", err);
  }
  return [DEMO_USER];
};

// ================= FARMS =================
export const getFarmsByUser = async (userId: string): Promise<Farm[]> => {
  try {
    if (db) {
      const farmsCol = collection(db, 'farms');
      const q = query(farmsCol, where('ownerId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Farm));
      }
    }
  } catch (err) {
    console.warn("Firestore getFarmsByUser error, falling back to local:", err);
  }

  const localFarms = getLocal<Farm[]>('farms', INITIAL_DEMO_FARMS);
  return localFarms.filter(f => f.ownerId === userId || userId === DEMO_USER.uid);
};

export const createFarm = async (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm> => {
  const newFarm: Farm = {
    ...farmData,
    id: `farm-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    if (db) {
      const farmRef = doc(db, 'farms', newFarm.id);
      await setDoc(farmRef, newFarm);
    }
  } catch (err) {
    console.warn("Firestore createFarm error, storing locally:", err);
  }

  const currentFarms = getLocal<Farm[]>('farms', INITIAL_DEMO_FARMS);
  setLocal('farms', [newFarm, ...currentFarms]);
  return newFarm;
};

export const updateFarm = async (farmId: string, updates: Partial<Farm>): Promise<void> => {
  const updatedWithTimestamp = { ...updates, updatedAt: new Date().toISOString() };
  try {
    if (db) {
      const farmRef = doc(db, 'farms', farmId);
      await updateDoc(farmRef, updatedWithTimestamp);
    }
  } catch (err) {
    console.warn("Firestore updateFarm error, updating locally:", err);
  }

  const currentFarms = getLocal<Farm[]>('farms', INITIAL_DEMO_FARMS);
  setLocal('farms', currentFarms.map(f => f.id === farmId ? { ...f, ...updatedWithTimestamp } : f));
};

export const deleteFarm = async (farmId: string): Promise<void> => {
  try {
    if (db) {
      await deleteDoc(doc(db, 'farms', farmId));
    }
  } catch (err) {
    console.warn("Firestore deleteFarm error:", err);
  }
  const currentFarms = getLocal<Farm[]>('farms', INITIAL_DEMO_FARMS);
  setLocal('farms', currentFarms.filter(f => f.id !== farmId));
};

// ================= CROPS =================
export const getCropsByUser = async (userId: string): Promise<Crop[]> => {
  try {
    if (db) {
      const cropsCol = collection(db, 'crops');
      const q = query(cropsCol, where('ownerId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Crop));
      }
    }
  } catch (err) {
    console.warn("Firestore getCropsByUser error, falling back to local:", err);
  }

  const localCrops = getLocal<Crop[]>('crops', INITIAL_DEMO_CROPS);
  return localCrops.filter(c => c.ownerId === userId || userId === DEMO_USER.uid);
};

export const createCrop = async (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Crop> => {
  const newCrop: Crop = {
    ...cropData,
    id: `crop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    if (db) {
      const cropRef = doc(db, 'crops', newCrop.id);
      await setDoc(cropRef, newCrop);
    }
  } catch (err) {
    console.warn("Firestore createCrop error, storing locally:", err);
  }

  const currentCrops = getLocal<Crop[]>('crops', INITIAL_DEMO_CROPS);
  setLocal('crops', [newCrop, ...currentCrops]);
  return newCrop;
};

export const updateCrop = async (cropId: string, updates: Partial<Crop>): Promise<void> => {
  const updatedWithTimestamp = { ...updates, updatedAt: new Date().toISOString() };
  try {
    if (db) {
      const cropRef = doc(db, 'crops', cropId);
      await updateDoc(cropRef, updatedWithTimestamp);
    }
  } catch (err) {
    console.warn("Firestore updateCrop error:", err);
  }

  const currentCrops = getLocal<Crop[]>('crops', INITIAL_DEMO_CROPS);
  setLocal('crops', currentCrops.map(c => c.id === cropId ? { ...c, ...updatedWithTimestamp } : c));
};

export const deleteCrop = async (cropId: string): Promise<void> => {
  try {
    if (db) {
      await deleteDoc(doc(db, 'crops', cropId));
    }
  } catch (err) {
    console.warn("Firestore deleteCrop error:", err);
  }
  const currentCrops = getLocal<Crop[]>('crops', INITIAL_DEMO_CROPS);
  setLocal('crops', currentCrops.filter(c => c.id !== cropId));
};

// ================= TASKS =================
export const getTasksByUser = async (userId: string): Promise<FarmingTask[]> => {
  try {
    if (db) {
      const tasksCol = collection(db, 'farmingTasks');
      const q = query(tasksCol, where('ownerId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as FarmingTask));
      }
    }
  } catch (err) {
    console.warn("Firestore getTasksByUser error, falling back to local:", err);
  }

  const localTasks = getLocal<FarmingTask[]>('tasks', INITIAL_DEMO_TASKS);
  return localTasks.filter(t => t.ownerId === userId || userId === DEMO_USER.uid);
};

export const createTask = async (taskData: Omit<FarmingTask, 'id' | 'createdAt'>): Promise<FarmingTask> => {
  const newTask: FarmingTask = {
    ...taskData,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  try {
    if (db) {
      const taskRef = doc(db, 'farmingTasks', newTask.id);
      await setDoc(taskRef, newTask);
    }
  } catch (err) {
    console.warn("Firestore createTask error:", err);
  }

  const currentTasks = getLocal<FarmingTask[]>('tasks', INITIAL_DEMO_TASKS);
  setLocal('tasks', [newTask, ...currentTasks]);
  return newTask;
};

export const toggleTaskStatus = async (taskId: string, currentStatus: 'pending' | 'completed' | 'postponed'): Promise<'pending' | 'completed'> => {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  try {
    if (db) {
      const taskRef = doc(db, 'farmingTasks', taskId);
      await updateDoc(taskRef, { status: newStatus });
    }
  } catch (err) {
    console.warn("Firestore toggleTaskStatus error:", err);
  }

  const currentTasks = getLocal<FarmingTask[]>('tasks', INITIAL_DEMO_TASKS);
  setLocal('tasks', currentTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  return newStatus;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    if (db) {
      await deleteDoc(doc(db, 'farmingTasks', taskId));
    }
  } catch (err) {
    console.warn("Firestore deleteTask error:", err);
  }
  const currentTasks = getLocal<FarmingTask[]>('tasks', INITIAL_DEMO_TASKS);
  setLocal('tasks', currentTasks.filter(t => t.id !== taskId));
};

// ================= AI CONVERSATIONS =================
export const getConversationsByUser = async (userId: string): Promise<Conversation[]> => {
  try {
    if (db) {
      const convsCol = collection(db, 'conversations');
      const q = query(convsCol, where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Conversation));
      }
    }
  } catch (err) {
    console.warn("Firestore getConversations error:", err);
  }

  return getLocal<Conversation[]>('conversations', []);
};

export const saveConversation = async (conv: Conversation): Promise<void> => {
  try {
    if (db) {
      const convRef = doc(db, 'conversations', conv.id);
      await setDoc(convRef, conv, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore saveConversation error:", err);
  }

  const currentConvs = getLocal<Conversation[]>('conversations', []);
  const exists = currentConvs.some(c => c.id === conv.id);
  const updated = exists ? currentConvs.map(c => c.id === conv.id ? conv : c) : [conv, ...currentConvs];
  setLocal('conversations', updated);
};

// Alias and helper exports for components
export const getFarms = getFarmsByUser;
export const getCrops = getCropsByUser;
export const getTasks = getTasksByUser;
export const getConversations = getConversationsByUser;

export const updateTask = async (taskId: string, updates: Partial<FarmingTask>): Promise<void> => {
  try {
    if (db) {
      const taskRef = doc(db, 'farmingTasks', taskId);
      await updateDoc(taskRef, updates);
    }
  } catch (err) {
    console.warn("Firestore updateTask error:", err);
  }

  const currentTasks = getLocal<FarmingTask[]>('tasks', INITIAL_DEMO_TASKS);
  setLocal('tasks', currentTasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
};

export const createConversation = async (userId: string, title: string, role: UserRole): Promise<Conversation> => {
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    userId,
    title,
    role,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await saveConversation(newConv);
  return newConv;
};

export const addMessageToConversation = async (convId: string, message: { sender: 'user' | 'ai'; text: string }): Promise<void> => {
  const currentConvs = getLocal<Conversation[]>('conversations', []);
  const conv = currentConvs.find(c => c.id === convId);
  if (conv) {
    const updated: Conversation = {
      ...conv,
      messages: [...conv.messages, { ...message, timestamp: new Date().toISOString() }],
      updatedAt: new Date().toISOString()
    };
    await saveConversation(updated);
  }
};

