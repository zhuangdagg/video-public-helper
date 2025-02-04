import { defHttp, httpApi } from '@/utils/http/axios';
import { LoginParams, SendCodeParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/authorization/login',
  Logout = '/authorization/logout',
  Register = '/authorization/register',
  SendCode = '/authorization/sendCode',
  GetUserInfo = '/system/account/userInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return httpApi.post<string>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return httpApi.get<any>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return httpApi.get({ url: Api.Logout });
}

export function sendCodeApi(params: SendCodeParams) {
  return httpApi.get({ url: Api.SendCode, params });
}

export function RegisterApi(data: any) {
  return httpApi.post({ url: Api.Register, data });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
