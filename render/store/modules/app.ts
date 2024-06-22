import { defineStore } from 'pinia';

import { store } from '..';

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    darkMode: 'light',
  }),
  getters: {},
  actions: {},
});

export function useAppStoreWithout() {
  return useAppStore(store);
}
