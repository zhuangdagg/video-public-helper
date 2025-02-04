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
    title: '发布时间',
    dataIndex: 'time',
  },
  {
    title: '内容标题',
    dataIndex: 'title',
  },
  {
    title: '账号名称',
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
        () => undefined,
      );
    },
  },
  {
    title: '账号ID',
    dataIndex: 'accountId',
  },
  {
    title: '发布结果',
    dataIndex: 'result',
    customRender: (row) => {
      return h(
        Tag,
        {
          bordered: false,
          color: row.value === 'success' ? 'green' : 'red',
        },
        () => (row.value === 'success' ? '发布成功' : '发布失败'),
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
