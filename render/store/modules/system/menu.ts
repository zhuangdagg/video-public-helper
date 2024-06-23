import { defineStore } from 'pinia';
import { ref } from 'vue';
import { store } from '@/store';
import * as Req from '@/api/sys/menu';
import { listToTree } from '@/utils/helper/treeHelper';

export const useMenuStore = defineStore('menuStore', () => {
  const inited = false;

  const menuTree = ref([]);

  const getMenuList = (params) => {
    return Req.page(params).then((res = []) => {
      res.data = listToTree(res.data || []);
      return res;
    });
  };

  const getMenuTree = () => {
    Req.all().then((res = []) => {
      menuTree.value = listToTree(res);
      console.log(menuTree);
    });
  };

  const _req = async (params, type: 'add' | 'edit' | 'del' = 'add') => {
    const _api = {
      add: Req.add,
      edit: Req.edit,
      del: Req.del,
    };
    const res = await _api[type](params);
    getMenuTree();
    return res;
  };

  const add = async (params) => {
    return _req(params, 'add');
  };
  const edit = async (params) => {
    return _req(params, 'edit');
  };
  const del = async (params) => {
    return _req(params, 'del');
  };

  // init data
  getMenuTree();

  return {
    menuTree,
    getMenuList,
    add,
    edit,
    del,
  };
});

export function useMenuStoreWithOut() {
  return useMenuStore(store);
}
