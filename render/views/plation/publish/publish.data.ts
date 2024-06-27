import { FormSchema } from '@/components/Form';

export const useData = () => {
  const schemas: FormSchema[] = [
    {
      field: 'title',
      label: '标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入内容标题',
      },
    },
    {
      field: 'desc',
      label: '描述',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入内容描述',
        rows: 4,
        maxlength: 1000,
        showCount: true,
      },
    },
  ];

  return {
    schemas,
  };
};
