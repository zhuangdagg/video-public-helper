import { BasicColumn, FormSchema } from '@/components/Table';

const columns: BasicColumn[] = [
  {
    title: '账号名称',
    dataIndex: 'name',
  },
  {
    title: '所属平台',
    dataIndex: 'plation',
  },
  {
    title: '状态',
    dataIndex: 'status',
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
