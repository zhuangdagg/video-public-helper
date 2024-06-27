/**
 * 平台类型
 */
export enum PlationTypeEnum {
  TITOK = 'titok',
  BILIBILI = 'bilibili',
  WECHAT = 'wechat',
}

export const PlationNames = {
  [PlationTypeEnum.TITOK]: '抖音',
  [PlationTypeEnum.BILIBILI]: 'Bilibili',
  [PlationTypeEnum.WECHAT]: '微信',
};

/**
 * 平台账号状态类型 - 正常/失效
 */
export enum AccountStatusEnum {
  /** 正常 */
  NORMAL,
  /** 失效，需重新登录 */
  INEFFECTIVE, //
}
