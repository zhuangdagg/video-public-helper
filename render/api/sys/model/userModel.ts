export enum LoginStateEnum {
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
  LOGIN = 'account',
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  type: LoginStateEnum;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  role: RoleInfo[];
  // 用户id
  id: string | number;
  // 用户名
  name: string;
  // 真实名字
  nickName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
