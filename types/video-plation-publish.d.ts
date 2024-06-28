import { AccountStatusEnum, PlationTypeEnum } from '@/enums/plationAccountEnum';

export interface PlationAccountInfo {
  accountId: string;
  name?: string;
  accountType: PlationTypeEnum;
  status: AccountStatusEnum;
  /** 登录信息 */
  storageState: string;
}

export interface VideoPublishInfo {
  title?: string;
  desc?: string;
  filePath: string;
  fileType: 'video' | 'image' | 'message';
  account: PlationAccountInfo[];
}

export interface VideoPublishResult {
  accountId: string;
  name?: string;
  result: 'success' | 'failure';
  time: string;
  title: string;
  detail?: any[];
}
