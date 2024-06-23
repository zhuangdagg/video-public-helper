import { UploadApiResult } from './model/uploadModel';
import { defHttp, httpApi } from '@/utils/http/axios';
import { UploadFileParams } from '#/axios';
import { useGlobSetting } from '@/hooks/setting';
import { AxiosProgressEvent } from 'axios';

const { uploadUrl = '', apiUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      timeout: 2 * 60 * 1000,
      url: apiUrl + uploadUrl,
      onUploadProgress,
    },
    params,
  );
}

// 分片上传发起
export function multipartUpload(data) {
  return httpApi.post<any>({ url: '/upload/multipart', data})
}

// 分片合并
export function uploadComplete(data) {
  return httpApi.post<any>({ url: '/upload/complete', data})
}
