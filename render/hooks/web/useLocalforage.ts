import localforage from 'localforage';

export function useLocalforage(
  config: LocalForageOptions = {
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
    name: 'USERINFO',
  },
): { localforage: LocalForage } {
  if (!localforage.config(config)) {
    console.error('localforge config failure');
    return null;
  }

  return {
    localforage,
  };
}
