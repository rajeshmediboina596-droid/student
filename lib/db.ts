import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');

// Types based on our schema
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'teacher' | 'student';
  twoFactorEnabled: boolean;
  notificationPreferences?: {
    emailAlerts: boolean;
    systemUpdates: boolean;
    newEnrollments: boolean;
  };
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  course: string;
  batch: string;
  dob?: string;
  phone?: string;
  address?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface Result {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  resultStatus: 'PASS' | 'FAIL';
  semester: number;
  createdAt: string;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
}

export interface StudentResource {
  id: string;
  studentId: string;
  name: string;
  url?: string;
  status: 'WANT_TO_LEARN' | 'LEARNING' | 'MASTER';
  certificateUrl?: string;
  category?: string;
  icon?: string;
  projects?: { name: string; url: string; description?: string }[];
  notes?: string;
  createdAt: string;
}

interface DBData {
  users: User[];
  studentProfiles: StudentProfile[];
  attendance: Attendance[];
  results: Result[];
  materials: Material[];
  studentResources: StudentResource[];
}

// Helper to read DB
function readDb(): DBData {
  try {
    if (!fs.existsSync(dbPath)) {
      // Return empty structure if file missing
      return { users: [], studentProfiles: [], attendance: [], results: [], materials: [], studentResources: [] };
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    return {
      users: parsed.users || [],
      studentProfiles: parsed.studentProfiles || [],
      attendance: parsed.attendance || [],
      results: parsed.results || [],
      materials: parsed.materials || [],
      studentResources: parsed.studentResources || []
    };
  } catch (error) {
    console.error("Error reading mock DB:", error);
    return { users: [], studentProfiles: [], attendance: [], results: [], materials: [], studentResources: [] };
  }
}

// Helper to write DB
function writeDb(data: DBData) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to mock DB:", error);
  }
}

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      const data = readDb();
      return data.users.find((u) => u.email === where.email) || null;
    },
    findFirst: async ({ where }: { where: { id: string } }) => {
      const data = readDb();
      return data.users.find((u) => u.id === where.id) || null;
    },
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt'> }) => {
      const dbData = readDb();
      const newUser: User = {
        ...data,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      dbData.users.push(newUser);
      writeDb(dbData);
      return newUser;
    },
    findMany: async (args: { where?: { role?: string } } = {}) => {
      const { where } = args;
      const data = readDb();
      if (where?.role) {
        return data.users.filter(u => u.role === where.role);
      }
      return data.users;
    },
    updateSettings: async (userId: string, settings: { twoFactorEnabled?: boolean, notificationPreferences?: User['notificationPreferences'] }) => {
      const dbData = readDb();
      const userIndex = dbData.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        if (settings.twoFactorEnabled !== undefined) {
          dbData.users[userIndex].twoFactorEnabled = settings.twoFactorEnabled;
        }
        if (settings.notificationPreferences) {
          dbData.users[userIndex].notificationPreferences = {
            ...(dbData.users[userIndex].notificationPreferences || { emailAlerts: false, systemUpdates: false, newEnrollments: false }),
            ...settings.notificationPreferences
          };
        }
        writeDb(dbData);
        return dbData.users[userIndex];
      }
      return null;
    }
  },
  studentProfile: {
    findUnique: async ({ where }: { where: { userId?: string; id?: string } }) => {
      const data = readDb();
      if (where.userId) return data.studentProfiles.find(p => p.userId === where.userId) || null;
      if (where.id) return data.studentProfiles.find(p => p.id === where.id) || null;
      return null;
    },
    create: async ({ data }: { data: Omit<StudentProfile, 'id'> }) => {
      const dbData = readDb();
      const newProfile = { ...data, id: `profile-${Date.now()}` };
      dbData.studentProfiles.push(newProfile);
      writeDb(dbData);
      return newProfile;
    },
    findMany: async () => {
      const data = readDb();
      return data.studentProfiles;
    },
    update: async ({ where, data }: { where: { userId?: string; id?: string }, data: Partial<StudentProfile> }) => {
      const dbData = readDb();
      let index = -1;
      if (where.userId) index = dbData.studentProfiles.findIndex(p => p.userId === where.userId);
      else if (where.id) index = dbData.studentProfiles.findIndex(p => p.id === where.id);

      if (index !== -1) {
        dbData.studentProfiles[index] = { ...dbData.studentProfiles[index], ...data };
        writeDb(dbData);
        return dbData.studentProfiles[index];
      }
      return null;
    }
  },
  attendance: {
    create: async ({ data }: { data: Omit<Attendance, 'id'> }) => {
      const dbData = readDb();
      const newRecord = { ...data, id: `att-${Date.now()}` };
      dbData.attendance.push(newRecord);
      writeDb(dbData);
      return newRecord;
    },
    findMany: async (args: { where?: { studentId?: string } } = {}) => {
      const { where } = args;
      const data = readDb();
      if (where?.studentId) {
        return data.attendance.filter(a => a.studentId === where.studentId);
      }
      return data.attendance;
    },
    upsert: async ({ where, create, update }: { where: { studentId: string; date: string }, create: Omit<Attendance, 'id'>, update: Partial<Attendance> }) => {
      const dbData = readDb();
      // Check for exact date match or date starting with the same YYYY-MM-DD if we want to be looser, 
      // but for now strict equality on what's passed is safest if we consistently pass YYYY-MM-DD
      const index = dbData.attendance.findIndex(a => a.studentId === where.studentId && a.date === where.date);

      if (index !== -1) {
        // Update existing
        dbData.attendance[index] = { ...dbData.attendance[index], ...update };
        writeDb(dbData);
        return dbData.attendance[index];
      } else {
        // Create new
        const newRecord = { ...create, id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
        dbData.attendance.push(newRecord);
        writeDb(dbData);
        return newRecord;
      }
    }
  },
  result: {
    create: async ({ data }: { data: Omit<Result, 'id' | 'createdAt'> }) => {
      const dbData = readDb();
      const newRes = { ...data, id: `res-${Date.now()}`, createdAt: new Date().toISOString() };
      dbData.results.push(newRes);
      writeDb(dbData);
      return newRes;
    },
    findMany: async (args: { where?: { studentId?: string } } = {}) => {
      const { where } = args;
      const data = readDb();
      if (where?.studentId) return data.results.filter(r => r.studentId === where.studentId);
      return data.results;
    }
  },
  material: {
    create: async ({ data }: { data: Omit<Material, 'id' | 'createdAt'> }) => {
      const dbData = readDb();
      const newMat = { ...data, id: `mat-${Date.now()}`, createdAt: new Date().toISOString() };
      dbData.materials.push(newMat);
      writeDb(dbData);
      return newMat;
    },
    findMany: async () => {
      return readDb().materials;
    }
  },
  studentResource: {
    findMany: async (args: { where?: { studentId?: string } } = {}) => {
      const { where } = args;
      const data = readDb();
      if (where?.studentId) {
        return data.studentResources.filter(r => r.studentId === where.studentId);
      }
      return data.studentResources;
    },
    create: async ({ data }: { data: Omit<StudentResource, 'id' | 'createdAt'> }) => {
      const dbData = readDb();
      const newResource: StudentResource = {
        ...data,
        id: `sr-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      dbData.studentResources.push(newResource);
      writeDb(dbData);
      return newResource;
    },
    update: async ({ where, data }: { where: { id: string }, data: Partial<Omit<StudentResource, 'id' | 'studentId' | 'createdAt'>> }) => {
      const dbData = readDb();
      const index = dbData.studentResources.findIndex(r => r.id === where.id);
      if (index !== -1) {
        // Ensure we don't accidentally overwrite with undefined if passing objects
        dbData.studentResources[index] = { ...dbData.studentResources[index], ...data };
        writeDb(dbData);
        return dbData.studentResources[index];
      }
      return null;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const dbData = readDb();
      dbData.studentResources = dbData.studentResources.filter(r => r.id !== where.id);
      writeDb(dbData);
      return true;
    }
  }
};
