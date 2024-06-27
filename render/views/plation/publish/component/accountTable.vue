<template>
  <div>
    <BasicTable @register="registerTable"> </BasicTable>
    <!-- <a-button block class="mt-5" type="dashed" @click="handleAdd"> 新增成员 </a-button> -->
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useLocalforage } from '@/hooks/web/useLocalforage';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '@/components/Table';

  const columns: BasicColumn[] = [
    {
      title: '账号名称',
      dataIndex: 'name',
    },
    {
      title: '账号ID',
      dataIndex: 'accountId',
    },
    {
      title: '账号类型',
      dataIndex: 'accountType',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
  ];
  const { localforage } = useLocalforage();
  const tableData = ref<any[]>([]);
  const [registerTable, tableMethod] = useTable({
    columns: columns,
    showIndexColumn: false,
    dataSource: tableData,
    scroll: { y: '100%' },
    pagination: false,
    rowKey: 'accountId',
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record) => ({
        disabled: record.status === 1,
      }),
    },
    showSelectionBar: true, // 显示多选状态栏
  });

  onMounted(() => {
    fetchTableData();
  });

  const fetchTableData = () => {
    const _list: any = [];
    localforage
      .iterate((val, key, index) => {
        _list.push(val);
      })
      .then((res) => {
        tableData.value = _list;
      }, console.error);
  };
  // 暴露getDataSource 供父组件使用
  defineExpose({
    getAccouont: tableMethod.getSelectRows,
  });
</script>
