import { api } from './client';
import type {
  Profile, Meal, Workout, Cardio, DashboardData, Quote, Achievement, Streaks, Settings,
} from '../types';

// ---- Profile ----
export const profileApi = {
  create: (data: Partial<Profile>) =>
    api.post<Profile>('/profile', data).then(r => r.data),
  get: (id: number) =>
    api.get<Profile>(`/profile/${id}`).then(r => r.data),
  update: (id: number, data: Partial<Profile>) =>
    api.put<Profile>(`/profile/${id}`, data).then(r => r.data),
};

// ---- Meals ----
export const mealsApi = {
  create: (data: Partial<Meal>) =>
    api.post<Meal>('/meals', data).then(r => r.data),
  getByDate: (profileId: number, date: string) =>
    api.get<Meal[]>(`/meals?profileId=${profileId}&date=${date}`).then(r => r.data),
  update: (id: number, data: Partial<Meal>) =>
    api.put<Meal>(`/meals/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/meals/${id}`).then(r => r.data),
  getFavorites: (profileId: number) =>
    api.get<Meal[]>(`/meals/favorites?profileId=${profileId}`).then(r => r.data),
  getRecent: (profileId: number) =>
    api.get<Meal[]>(`/meals/recent?profileId=${profileId}`).then(r => r.data),
};

// ---- Workouts ----
export const workoutsApi = {
  create: (data: any) =>
    api.post<Workout>('/workouts', data).then(r => r.data),
  getByDate: (profileId: number, date: string) =>
    api.get<Workout[]>(`/workouts?profileId=${profileId}&date=${date}`).then(r => r.data),
  getById: (id: number) =>
    api.get<Workout>(`/workouts/${id}`).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/workouts/${id}`).then(r => r.data),
  getTemplates: (profileId: number) =>
    api.get<Workout[]>(`/workouts/templates?profileId=${profileId}`).then(r => r.data),
  getRecords: (profileId: number) =>
    api.get<any[]>(`/workouts/records?profileId=${profileId}`).then(r => r.data),
};

// ---- Cardio ----
export const cardioApi = {
  create: (data: Partial<Cardio>) =>
    api.post<Cardio>('/cardio', data).then(r => r.data),
  getByDate: (profileId: number, date: string) =>
    api.get<Cardio[]>(`/cardio?profileId=${profileId}&date=${date}`).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/cardio/${id}`).then(r => r.data),
};

// ---- Trackers ----
export const waterApi = {
  log: (profileId: number, date: string, amount: number, unit = 'glasses') =>
    api.post('/water', { profileId, date, amount, unit }).then(r => r.data),
  get: (profileId: number, date: string) =>
    api.get(`/water?profileId=${profileId}&date=${date}`).then(r => r.data),
};

export const sleepApi = {
  log: (data: any) =>
    api.post('/sleep', data).then(r => r.data),
  get: (profileId: number, date: string) =>
    api.get(`/sleep?profileId=${profileId}&date=${date}`).then(r => r.data),
};

export const stepsApi = {
  log: (profileId: number, date: string, count: number) =>
    api.post('/steps', { profileId, date, count }).then(r => r.data),
  get: (profileId: number, date: string) =>
    api.get(`/steps?profileId=${profileId}&date=${date}`).then(r => r.data),
};

export const weightApi = {
  log: (profileId: number, date: string, weight: number) =>
    api.post('/weight', { profileId, date, weight }).then(r => r.data),
  getHistory: (profileId: number, range = '1M') =>
    api.get(`/weight?profileId=${profileId}&range=${range}`).then(r => r.data),
};

// ---- Targets ----
export const targetsApi = {
  create: (profileId: number, name: string) =>
    api.post('/targets', { profileId, name }).then(r => r.data),
  getAll: (profileId: number) =>
    api.get(`/targets?profileId=${profileId}`).then(r => r.data),
  update: (id: number, data: any) =>
    api.put(`/targets/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/targets/${id}`).then(r => r.data),
  logDaily: (data: any) =>
    api.post('/targets/daily', data).then(r => r.data),
};

// ---- Dashboard ----
export const dashboardApi = {
  get: (profileId: number, date: string) =>
    api.get<DashboardData>(`/dashboard?profileId=${profileId}&date=${date}`).then(r => r.data),
};

// ---- Progress ----
export const progressApi = {
  weight: (profileId: number, range = '1M') =>
    api.get(`/progress/weight?profileId=${profileId}&range=${range}`).then(r => r.data),
  calories: (profileId: number, range = '1W') =>
    api.get(`/progress/calories?profileId=${profileId}&range=${range}`).then(r => r.data),
  macros: (profileId: number, range = '1W') =>
    api.get(`/progress/macros?profileId=${profileId}&range=${range}`).then(r => r.data),
  completion: (profileId: number, range = '1W') =>
    api.get(`/progress/completion?profileId=${profileId}&range=${range}`).then(r => r.data),
  habits: (profileId: number) =>
    api.get(`/progress/habits?profileId=${profileId}`).then(r => r.data),
  summary: (profileId: number) =>
    api.get(`/progress/summary?profileId=${profileId}`).then(r => r.data),
};

// ---- Streaks & Achievements ----
export const streaksApi = {
  get: (profileId: number) =>
    api.get<Streaks>(`/streaks?profileId=${profileId}`).then(r => r.data),
};

export const achievementsApi = {
  getAll: (profileId: number) =>
    api.get<Achievement[]>(`/achievements?profileId=${profileId}`).then(r => r.data),
};

// ---- Settings ----
export const settingsApi = {
  get: (profileId: number) =>
    api.get<Settings>(`/settings?profileId=${profileId}`).then(r => r.data),
  update: (profileId: number, data: Partial<Settings>) =>
    api.put<Settings>(`/settings?profileId=${profileId}`, data).then(r => r.data),
};

// ---- Quote ----
export const quoteApi = {
  get: () => api.get<Quote>('/quote').then(r => r.data),
};
