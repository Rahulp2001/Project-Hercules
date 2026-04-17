import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '../types';

interface ProfileState {
  profile: Profile | null;
  profileId: number | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      profileId: null,
      setProfile: (profile) => set({ profile, profileId: profile.id }),
      clearProfile: () => set({ profile: null, profileId: null }),
    }),
    { name: 'hercules-profile' }
  )
);
