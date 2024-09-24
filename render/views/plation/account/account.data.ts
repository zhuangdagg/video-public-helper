import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Avatar, Tag } from 'ant-design-vue';
import { PlationNames } from '@/enums/plationAccountEnum';

import tiktokIcon from '../images/tiktok.png';
import biliIcon from '../images/bilibili.png';
import wechatIcon from '../images/wechat.png';

const PlationLogos: Record<string, string> = {
  titok: tiktokIcon,
  bilibili: biliIcon,
  wechat: wechatIcon,
};

const columns: BasicColumn[] = [
  {
    title: '',
    dataIndex: 'avatar',
    width: 60,
    customRender: (row) => {
      return h(
        Avatar,
        {
          src: row.value,
          shape: 'square',
        },
        () => undefined,
      );
    },
  },
  {
    title: '账号',
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: '所属平台',
    dataIndex: 'accountType',
    width: 100,
    // align: 'left',
    // format: (text) => {
    //   return (PlationNames as any)[text] || '';
    // },
    customRender: (row) => {
      return h(
        Avatar,
        {
          src: PlationLogos[row.value],
          shape: 'square',
          title: PlationNames[row.value] || '',
        },
        () => '',
      );
    },
  },
  {
    title: '账号ID',
    dataIndex: 'accountId',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (row) => {
      return h(
        Tag,
        {
          bordered: false,
          color: row.value ? 'red' : 'green',
        },
        () => (row.value ? '登录失效' : '正常'),
      );
    },
  },
];

const formSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '账号名称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const useData = () => {
  return {
    columns,
    formSchemas,
  };
};
