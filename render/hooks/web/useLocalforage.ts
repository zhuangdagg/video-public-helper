import localforage from 'localforage';

import { useUserStore } from '@/store/modules/user';

export function useLocalforage(
  config: LocalForageOptions = {
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
    name: 'default',
  },
): { [key: string]: LocalForage } {
  const userId = useUserStore().getUserInfo.id;
  if (
    !localforage.config({
      ...config,
      name: config.name + '-' + userId,
    })
  ) {
    console.error('localforge config failure');
    return null;
  }
  const accountForage = localforage.createInstance({
    ...config,
    name: 'ACCOUNT' + '-' + userId,
  });
  const publishRecordForage = localforage.createInstance({
    ...config,
    name: 'PUBLISH-RECORD' + '-' + userId,
  });
  return {
    localforage,
    accountForage,
    publishRecordForage,
  };
}
