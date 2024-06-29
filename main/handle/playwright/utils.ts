import { Page } from 'playwright';

/**
 * 判断是否是目标页面
 * @param page
 */
export const isTargePage = async (page: Page, targetUrl: string) => {
  const url = await page.url();
  console.log({ url, targetUrl });
  return url === targetUrl;
};

/**
 * 获取抖音用户信息
 *【页面】https://creator.douyin.com/creator-micro/home
 *【接口信息】POST https://creator.douyin.com/aweme/v1/creator/homepage/module/ { module_key_list: ['PERSONAL_PROFILE'], tpl_id: '2' }
 * @param page
 */
export const getTitokUserinfo = async (page: Page, userInfo: Record<string, any>) => {
  await page.goto('https://creator.douyin.com/creator-micro/home');
  try {
    const res = await page.waitForResponse((response) => {
      if (
        response.url().indexOf('module') > -1 &&
        response.request().method() === 'POST' &&
        response.status() == 200
      ) {
        const data = response.request().postDataJSON();
        return data && data.module_key_list && data.module_key_list.includes('PERSONAL_PROFILE');
      }

      return false;
    });

    const { data } = (await res.json()) as TitokPersonalProfileRes;
    const userProfile =
      data?.PERSONAL_PROFILE?.module_data?.personal_profile?.user_profile ||
      ({} as TitokPersonalProfile['user_profile']);

    // 赋值
    userInfo.origin = userProfile;
    userInfo.name = userProfile.nick_name;
    userInfo.accountId = userProfile.unique_id;
    userInfo.fans = userProfile.follower_count;
    userInfo.avatar = userProfile.avatar_url;

    return userProfile as TitokPersonalProfile['user_profile'];
  } catch (err) {
    return {} as TitokPersonalProfile['user_profile'];
  }
};

export interface TitokPersonalProfileRes {
  data: {
    PERSONAL_PROFILE: {
      is_perm: boolean;
      module_data: {
        personal_profile: TitokPersonalProfile;
      };
      module_key: 'PERSONAL_PROFILE';
      module_type: 'DEFAULT';
    };
  };
  extra: {
    now: number;
  };
  status_code: number;
  status_msg: string;
}

export interface TitokPersonalProfile {
  douyin_user_verify_info: {
    /** 头像路径 */
    avatar_url: string;
    /** accountId */
    douyin_unique_id: string;
    follower_count: number;
    following_count: number;
    is_super_tag_user: boolean;
    /** 昵称 */
    nick_name: string;
    /** 同步于西瓜视频 */
    sync_to_xigua: boolean;
    teen_model: boolean;

    total_favorited: number;
  };

  person_confer_info: {
    to_audit_count: number;
    valid_count: number;
  };
  person_info: {
    category: string;
  };
  user_profile: {
    account_region: string;
    avatar_url: string;
    follower_count: number;
    following_count: number;
    gender: 0 | 1; // 0 男 1女
    location: string;
    login_with_only_tc: false;
    mobile: string;
    nick_name: string;
    region: string;
    school: string;
    secret_id: string;
    signature: string;
    /** 点赞数？ */
    total_favorited: number;
    /** accountId */
    unique_id: string;
    vcd_info: {
      auth_relation_time: number;
      auth_time: number;
      aweme_hotsoon_auth: number;
      aweme_hotsoon_auth_relation: number;
      register_from: string;
    };
  };
}

// {
//   "douyin_user_verify_info": {
//       "avatar_url": "https://p3.douyinpic.com/aweme/100x100/aweme-avatar/mosaic-legacy_3791_5070639578.jpeg?from=2956013662",
//       "douyin_unique_id": "68143622679",
//       "follower_count": 0,
//       "following_count": 0,
//       "is_super_tag_user": false,
//       "nick_name": "雨的",
//       "sync_to_xigua": false,
//       "teen_model": false,
//       "total_favorited": 0
//   },
//   "person_confer_info": {
//       "to_audit_count": 0,
//       "valid_count": 0
//   },
//   "person_info": {
//       "category": ""
//   },
//   "user_profile": {
//       "account_region": "",
//       "avatar_url": "https://p3.douyinpic.com/aweme/100x100/aweme-avatar/mosaic-legacy_3791_5070639578.jpeg?from=2956013662",
//       "follower_count": 0,
//       "following_count": 0,
//       "gender": 0,
//       "location": "",
//       "login_with_only_tc": false,
//       "mobile": "135******15",
//       "nick_name": "雨的",
//       "region": "CN",
//       "school": "",
//       "secret_id": "MS4wLjABAAAASXaakrxo_FKGgfmFmObzQfWk0wocbrFMqX2P0Z9zOoTUDizM_sQbf1megrgKpVcC",
//       "signature": "",
//       "total_favorited": 0,
//       "unique_id": "68143622679",
//       "vcd_info": {
//           "auth_relation_time": 1696482135,
//           "auth_time": 1696482135,
//           "aweme_hotsoon_auth": 1,
//           "aweme_hotsoon_auth_relation": 1,
//           "register_from": ""
//       }
//   }
// }
