import { httpApi } from '@/utils/http/axios';

const prefix = '/system/account';
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
