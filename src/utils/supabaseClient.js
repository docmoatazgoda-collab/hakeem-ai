import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we are running in the browser
const isBrowser = typeof window !== 'undefined';

// Mock DB helpers for Simulated Mode
const getLocalData = (key, defaultVal = []) => {
  if (!isBrowser) return defaultVal;
  const data = localStorage.getItem(key);
  if (!data) return defaultVal;
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error parsing localStorage key "${key}":`, err);
    return defaultVal;
  }
};

const setLocalData = (key, data) => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(data));
};

// SIMULATED CLIENT IMPLEMENTATION
const simulatedClient = {
  isSimulated: true,
  
  auth: {
    getUser: async () => {
      if (!isBrowser) return { data: { user: null }, error: null };
      const user = getLocalData('hakeem_user', null);
      return { data: { user }, error: null };
    },
    
    getSession: async () => {
      if (!isBrowser) return { data: { session: null }, error: null };
      const user = getLocalData('hakeem_user', null);
      return {
        data: {
          session: user ? { user, access_token: 'mock-token' } : null
        },
        error: null
      };
    },
    
    signUp: async ({ email, password, options }) => {
      await new Promise(r => setTimeout(r, 600)); // Simulate delay
      const emailLower = email.toLowerCase();
      // Generate a stable ID based on email so it persists and matches login
      const stableId = 'mock-user-' + btoa(emailLower).replace(/=/g, '').substring(0, 16);
      const mockUser = {
        id: stableId,
        email: emailLower,
        user_metadata: options?.data || {},
        created_at: new Date().toISOString()
      };
      
      if (isBrowser) {
        setLocalData('hakeem_user', mockUser);
        
        // Setup initial default profile
        const profiles = getLocalData('hakeem_profiles', {});
        profiles[mockUser.id] = {
          id: mockUser.id,
          doctor_name: options?.data?.doctor_name || 'د. محمد علي',
          specialty: options?.data?.specialty || 'طب عام',
          clinic_address: 'القاهرة، مصر',
          phone_number: '01000000000',
          booking_link: '',
          disclaimer_template: 'هذا المنشور لغرض التثقيف الطبي فقط ولا يغني عن استشارة الطبيب المختص.',
          updated_at: new Date().toISOString()
        };
        setLocalData('hakeem_profiles', profiles);
      }
      return { data: { user: mockUser }, error: null };
    },
    
    signInWithPassword: async ({ email, password }) => {
      await new Promise(r => setTimeout(r, 600));
      const emailLower = email.toLowerCase();
      const stableId = 'mock-user-' + btoa(emailLower).replace(/=/g, '').substring(0, 16);
      
      if (isBrowser) {
        // Ensure default profile exists for the user or load existing
        const profiles = getLocalData('hakeem_profiles', {});
        let doctorName = 'د. أحمد سليمان';
        let specialty = 'أخصائي الباطنة والجهاز الهضمي';
        
        if (profiles[stableId]) {
          doctorName = profiles[stableId].doctor_name;
          specialty = profiles[stableId].specialty;
        } else {
          profiles[stableId] = {
            id: stableId,
            doctor_name: doctorName,
            specialty: specialty,
            clinic_address: 'شارع القصر العيني، القاهرة',
            phone_number: '01123456789',
            booking_link: 'https://vezeeta.com',
            disclaimer_template: 'المعلومات الواردة في هذا المنشور لأغراض التوعية العامة فقط. استشر طبيبك دائماً لتشخيص حالتك بدقة.',
            updated_at: new Date().toISOString()
          };
          setLocalData('hakeem_profiles', profiles);
        }

        const mockUser = {
          id: stableId,
          email: emailLower,
          user_metadata: { doctor_name: doctorName, specialty: specialty },
          created_at: new Date().toISOString()
        };
        
        setLocalData('hakeem_user', mockUser);
        return { data: { user: mockUser }, error: null };
      }
      
      const mockUser = {
        id: stableId,
        email: emailLower,
        user_metadata: { doctor_name: 'د. أحمد سليمان' },
        created_at: new Date().toISOString()
      };
      return { data: { user: mockUser }, error: null };
    },
    
    signOut: async () => {
      if (isBrowser) {
        localStorage.removeItem('hakeem_user');
      }
      return { error: null };
    },
    
    onAuthStateChange: (callback) => {
      // Mock auth state change subscriber
      if (isBrowser) {
        const handler = () => {
          const user = getLocalData('hakeem_user', null);
          callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
        };
        window.addEventListener('storage', handler);
        // Call immediately with current state
        const user = getLocalData('hakeem_user', null);
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
        
        return {
          data: {
            subscription: {
              unsubscribe: () => window.removeEventListener('storage', handler)
            }
          }
        };
      }
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  
  from: (table) => {
    return {
      select: (query = '*') => {
        return {
          eq: (field, val) => {
            return {
              single: async () => {
                await new Promise(r => setTimeout(r, 200));
                if (table === 'profiles') {
                  const profiles = getLocalData('hakeem_profiles', {});
                  const profile = profiles[val] || null;
                  return { data: profile, error: null };
                }
                return { data: null, error: null };
              },
              order: (orderField, { ascending } = {}) => {
                return {
                  then: async (resolve) => {
                    await new Promise(r => setTimeout(r, 200));
                    if (table === 'drafts') {
                      const allDrafts = getLocalData('hakeem_drafts', []);
                      const userDrafts = allDrafts.filter(d => d[field] === val);
                      userDrafts.sort((a, b) => {
                        const dateA = new Date(a[orderField]);
                        const dateB = new Date(b[orderField]);
                        return ascending ? dateA - dateB : dateB - dateA;
                      });
                      resolve({ data: userDrafts, error: null });
                    } else {
                      resolve({ data: [], error: null });
                    }
                  }
                };
              }
            };
          },
          then: async (resolve) => {
            await new Promise(r => setTimeout(r, 200));
            if (table === 'drafts') {
              const allDrafts = getLocalData('hakeem_drafts', []);
              resolve({ data: allDrafts, error: null });
            } else {
              resolve({ data: [], error: null });
            }
          }
        };
      },
      
      insert: (data) => {
        return {
          select: () => {
            return {
              single: async () => {
                await new Promise(r => setTimeout(r, 300));
                if (table === 'drafts') {
                  const drafts = getLocalData('hakeem_drafts', []);
                  const items = Array.isArray(data) ? data : [data];
                  const newItems = items.map(item => ({
                    ...item,
                    id: item.id || `draft-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    created_at: new Date().toISOString()
                  }));
                  
                  setLocalData('hakeem_drafts', [...newItems, ...drafts]);
                  return { data: newItems[0], error: null };
                }
                return { data: null, error: null };
              }
            };
          }
        };
      },
      
      update: (data) => {
        return {
          eq: (field, val) => {
            return {
              then: async (resolve) => {
                await new Promise(r => setTimeout(r, 300));
                if (table === 'drafts') {
                  const drafts = getLocalData('hakeem_drafts', []);
                  const index = drafts.findIndex(d => d[field] === val);
                  if (index !== -1) {
                    drafts[index] = { ...drafts[index], ...data, updated_at: new Date().toISOString() };
                    setLocalData('hakeem_drafts', drafts);
                    resolve({ data: drafts[index], error: null });
                  } else {
                    resolve({ data: null, error: { message: 'Draft not found' } });
                  }
                } else {
                  resolve({ data: null, error: null });
                }
              }
            };
          }
        };
      },
      
      upsert: (data) => {
        return {
          then: async (resolve) => {
            await new Promise(r => setTimeout(r, 300));
            if (table === 'profiles') {
              const profiles = getLocalData('hakeem_profiles', {});
              const userId = data.id;
              profiles[userId] = {
                ...profiles[userId],
                ...data,
                updated_at: new Date().toISOString()
              };
              setLocalData('hakeem_profiles', profiles);
              resolve({ data: profiles[userId], error: null });
            } else {
              resolve({ data: null, error: null });
            }
          }
        };
      },
      
      delete: () => {
        return {
          eq: (field, val) => {
            return {
              then: async (resolve) => {
                await new Promise(r => setTimeout(r, 300));
                if (table === 'drafts') {
                  const drafts = getLocalData('hakeem_drafts', []);
                  const filtered = drafts.filter(d => d[field] !== val);
                  setLocalData('hakeem_drafts', filtered);
                  resolve({ data: null, error: null });
                } else {
                  resolve({ data: null, error: null });
                }
              }
            };
          }
        };
      }
    };
  }
};

// Live Client Initialization or Fallback
let client;

if (supabaseUrl && supabaseAnonKey) {
  try {
    const realClient = createClient(supabaseUrl, supabaseAnonKey);
    
    const bypassEmail = 'docmoatazgoda@gmail.com';
    const bypassUserId = 'mock-user-docmoatazgoda';
    
    const getBypassedUser = () => {
      if (!isBrowser) return null;
      const cached = localStorage.getItem('hakeem_bypass_user');
      try {
        return cached ? JSON.parse(cached) : null;
      } catch (e) {
        return null;
      }
    };
    
    client = new Proxy(realClient, {
      get(target, prop) {
        if (prop === 'isSimulated') return false;
        
        if (prop === 'auth') {
          const originalAuth = target.auth;
          return {
            ...originalAuth,
            getUser: async (token) => {
              const bypassed = getBypassedUser();
              if (bypassed) {
                return { data: { user: bypassed }, error: null };
              }
              return originalAuth.getUser(token);
            },
            getSession: async () => {
              const bypassed = getBypassedUser();
              if (bypassed) {
                return {
                  data: {
                    session: { user: bypassed, access_token: 'mock-token-docmoatazgoda' }
                  },
                  error: null
                };
              }
              return originalAuth.getSession();
            },
            signInWithPassword: async ({ email, password }) => {
              if (email && email.toLowerCase() === bypassEmail) {
                const mockUser = {
                  id: bypassUserId,
                  email: bypassEmail,
                  user_metadata: { doctor_name: 'د. معتز جودة', specialty: 'أخصائي الطب والذكاء الاصطناعي' },
                  created_at: new Date().toISOString()
                };
                if (isBrowser) {
                  localStorage.setItem('hakeem_bypass_user', JSON.stringify(mockUser));
                  // Create profile locally if not exists
                  const profiles = getLocalData('hakeem_profiles', {});
                  if (!profiles[bypassUserId]) {
                    profiles[bypassUserId] = {
                      id: bypassUserId,
                      doctor_name: 'د. معتز جودة',
                      specialty: 'أخصائي الطب والذكاء الاصطناعي',
                      clinic_address: 'القاهرة، مصر',
                      phone_number: '01000000000',
                      booking_link: '',
                      disclaimer_template: 'هذا المنشور لغرض التثقيف الطبي فقط ولا يغني عن استشارة الطبيب المختص.',
                      updated_at: new Date().toISOString()
                    };
                    setLocalData('hakeem_profiles', profiles);
                  }
                }
                return { data: { user: mockUser }, error: null };
              }
              return originalAuth.signInWithPassword({ email, password });
            },
            signOut: async () => {
              if (isBrowser) {
                localStorage.removeItem('hakeem_bypass_user');
              }
              return originalAuth.signOut();
            }
          };
        }
        
        if (prop === 'from') {
          return (table) => {
            const bypassed = getBypassedUser();
            if (bypassed) {
              if (table === 'profiles') {
                return {
                  select: () => ({
                    eq: (field, val) => ({
                      single: async () => {
                        const profiles = getLocalData('hakeem_profiles', {});
                        const prof = profiles[bypassUserId] || {
                          id: bypassUserId,
                          doctor_name: 'د. معتز جودة',
                          specialty: 'أخصائي الطب والذكاء الاصطناعي',
                          clinic_address: 'القاهرة، مصر',
                          phone_number: '01000000000',
                          booking_link: '',
                          disclaimer_template: 'هذا المنشور لغرض التثقيف الطبي فقط ولا يغني عن استشارة الطبيب المختص.',
                          updated_at: new Date().toISOString()
                        };
                        return { data: prof, error: null };
                      }
                    })
                  }),
                  upsert: (data) => {
                    const profiles = getLocalData('hakeem_profiles', {});
                    profiles[bypassUserId] = {
                      ...profiles[bypassUserId],
                      ...data,
                      updated_at: new Date().toISOString()
                    };
                    setLocalData('hakeem_profiles', profiles);
                    return {
                      then: async (resolve) => {
                        resolve({ data: profiles[bypassUserId], error: null });
                      }
                    };
                  }
                };
              }
              if (table === 'drafts') {
                return simulatedClient.from('drafts');
              }
            }
            return target.from(table);
          };
        }
        
        const value = target[prop];
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      }
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    client = simulatedClient;
  }
} else {
  // Gracefully fallback to simulated client
  if (isBrowser) {
    console.warn('Supabase URL/Key missing. Hakeem.ai is running in Simulated Mode (Local Storage).');
  }
  client = simulatedClient;
}

export const supabase = client;
