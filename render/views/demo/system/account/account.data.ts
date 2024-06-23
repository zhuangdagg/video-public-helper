import { getAllRoleList, isAccountExist } from '@/api/demo/system';
import { BasicColumn, FormSchema } from '@/components/Table';
import * as roleApi from '@/api/sys/role';
import { useDepartmentStoreWithOut } from '@/store/modules/system/department';

const deptStore = useDepartmentStoreWithOut();
/**
 * transform mock data
 * {
 *  0: '华东分部',
 * '0-0': '华东分部-研发部'
 * '0-1': '华东分部-市场部',
 *  ...
 * }
 */
export const deptMap = (() => {
  const pDept = ['华东分部', '华南分部', '西北分部'];
  const cDept = ['研发部', '市场部', '商务部', '财务部'];

  return pDept.reduce((map, p, pIdx) => {
    map[pIdx] = p;

    cDept.forEach((c, cIndex) => (map[`${pIdx}-${cIndex}`] = `${p}-${c}`));

    return map;
  }, {});
})();

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
  },
  {
    title: '角色',
    dataIndex: 'roleList',
    format(text: any[]) {
      return (text as any[]).map((item) => item.name).join(',');
    },
    width: 200,
  },
  {
    title: '所属部门',
    dataIndex: ['dept', 'name'],
  },
  {
    title: '备注',
    dataIndex: 'desc',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '用户名',
    component: 'Input',
    helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
      // {
      //   trigger: 'blur',
      //   validator(_, value) {
      //     return new Promise((resolve, reject) => {
      //       if (!value) return resolve();
      //       isAccountExist(value)
      //         .then(resolve)
      //         .catch((err) => {
      //           reject(err.message || '验证失败');
      //         });
      //     });
      //   },
      // },
    ],
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    // ifShow: false,
  },
  {
    label: '角色',
    field: 'role',
    component: 'ApiSelect',
    componentProps: {
      api: roleApi.all,
      labelField: 'name',
      valueField: 'roleValue',
      mode: 'multiple',
    },
    required: true,
  },
  {
    field: 'dept',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps() {
      return {
        treeData: deptStore.departmentTree,
        fieldNames: {
          label: 'name',
          key: 'id',
          value: 'id',
        },
        getPopupContainer: () => document.body,
      };
    },
    required: true,
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    required: true,
  },

  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },
  {
    label: '电话',
    field: 'phone',
    component: 'Input',
    required: true,
  },

  {
    label: '备注',
    field: 'desc',
    component: 'InputTextArea',
  },
];
