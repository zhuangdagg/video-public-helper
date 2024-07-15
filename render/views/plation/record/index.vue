<template>
  <BasicTable @register="registerTable"></BasicTable>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, TableAction, ActionItem } from '@/components/Table';

  import { useData } from './record.data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useLocalforage } from '@/hooks/web/useLocalforage';
  import { ref, reactive, onMounted, nextTick, computed } from 'vue';

  const { columns, formSchemas } = useData();
  const { createMessage } = useMessage();
  const { publishRecordForage } = useLocalforage();
  defineOptions({ name: 'PublishRecord' });

  const fetchTableData = () => {
    return new Promise((resolve, reject) => {
      const _list: any = [];
      publishRecordForage
        .iterate((val, key, index) => {
          _list.push(val);
        })
        .then(() => {
          console.log({ _list });
          resolve({
            data: _list,
            total: _list.length,
          });
        });
    });
  };

  const [registerTable, tableMethod] = useTable({
    title: '发布记录',
    columns,
    rowKey: 'publishId',
    showIndexColumn: false,
    // bordered: true,
    api: fetchTableData,
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: formSchemas,
    },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
  });
</script>
