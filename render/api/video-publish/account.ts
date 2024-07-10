import { httpV1 } from '@/utils/http/axios';

const prefix = '/video-publish/account';

const Api: Record<string, string> = {
  add: '/add',
};

for (let k in Api) {
  Api[k] = `${prefix}${Api[k]}`;
}

export const add = <T = any>(data: T) => httpV1.post<T>({ url: Api.add, data });
