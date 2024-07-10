import { defineStore } from 'pinia';

import { ref } from 'vue';

import { store } from '@/store';

import * as accountApi from '@/api/video-publish/account';

export const useVideoPublishStore = defineStore('video-publish', () => {
  const accountAdd = (data: any) => {
    return accountApi.add(data);
  };
  return {
    accountAdd,
  };
});

export function useDepartmentStoreWithOut() {
  return useVideoPublishStore(store);
}
