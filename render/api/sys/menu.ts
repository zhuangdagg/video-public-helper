import { defHttp, httpApi } from '@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum _Api {
  GetMenuList = '/getMenuList',
}

const prefix = '/system/adminMenu';
const Api = {
  page: '/page',
  add: '/add',
  edit: '/edit',
  del: '/del',
  all: '/all',
};

for (let k in Api) {
  Api[k] = `${prefix}${Api[k]}`;
}

export const page = (params) => httpApi.get<any>({ url: Api.page, params });
export const all = () => httpApi.get<any>({ url: Api.all });

export const add = (data) => httpApi.post<any>({ url: Api.add, data });
export const edit = (data) => httpApi.post<any>({ url: Api.edit, data });
export const del = (params: { ids: string }) => httpApi.get<any>({ url: Api.del, params });

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  // return defHttp.get<getMenuListResultModel>({ url: _Api.GetMenuList });
  return httpApi.get({ url: Api.all });
};
