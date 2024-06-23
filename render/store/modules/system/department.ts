import { defineStore } from 'pinia';
import { ref } from 'vue';
import { store } from '@/store';
import * as depApi from '@/api/sys/department';
import { listToTree } from '@/utils/helper/treeHelper';

export const useDepartmentStore = defineStore('department', () => {
  const inited = false;

  const departmentTree = ref([]);

  const getDepartmentList = (params) => {
    return depApi.page(params).then((res = []) => {
      res.data = listToTree(res.data || []);
      return res;
    });
  };

  const getDeptTree = () => {
    depApi.all().then((res = []) => {
      departmentTree.value = listToTree(res);
    });
  };

  const _req = async (params, type: 'add' | 'edit' | 'del' = 'add') => {
    const _api = {
      add: depApi.add,
      edit: depApi.edit,
      del: depApi.del,
    };
    const res = await _api[type](params);
    getDeptTree();
    return res;
  };

  const addDept = async (params) => {
    return _req(params, 'add');
  };
  const editDept = async (params) => {
    return _req(params, 'edit');
  };
  const delDept = async (params) => {
    return _req(params, 'del');
  };

  //
  getDeptTree();

  return {
    departmentTree,
    getDepartmentList,
    addDept,
    editDept,
    delDept,
  };
});

export function useDepartmentStoreWithOut() {
  return useDepartmentStore(store);
}
