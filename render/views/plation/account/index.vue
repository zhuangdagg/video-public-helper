<template>
  <PageWrapper contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Dropdown>
          <a-button type="primary">
            新增账号
            <Icon icon="material-symbols:keyboard-arrow-down"></Icon>
          </a-button>
          <template #overlay>
            <Menu @click="handleCreate">
              <MenuItem v-for="[key, name] in Object.entries(PlationNames)" :key="key">{{
                name
              }}</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { useData } from './account.data';
  import Icon from '@/components/Icon/Icon.vue';
  import { Dropdown, Menu, MenuItem, message } from 'ant-design-vue';

  import { PlationTypeEnum, PlationNames } from '@/enums/plationAccountEnum';
  import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';

  import { useMessage } from '@/hooks/web/useMessage';
  import { createLoading } from '@/components/Loading';
  import { useLocalforage } from '@/hooks/web/useLocalforage';
  import { useIPC } from '@/hooks/web/useIPC';
  import { ref, onMounted, nextTick, computed } from 'vue';

  const { columns, formSchemas } = useData();
  const { createMessage } = useMessage();
  const { localforage } = useLocalforage();
  const { accountLogin } = useIPC();
  const globalLoading = createLoading({ tip: '请在浏览器完成登录操作' });
  defineOptions({ name: 'plationAccountManage' });

  const tableData = ref<object[]>([]);

  const fetchTableData = () => {
    return new Promise((resolve, reject) => {
      const _list: any = [];
      localforage
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
    title: '账号列表',
    columns,
    rowKey: 'accountId',
    bordered: true,
    api: fetchTableData,
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: formSchemas,
    },
  });

  onMounted(() => {
    // fetchTableData();
  });

  const handleCreate: MenuClickEventHandler = (evt) => {
    console.log(evt);
    switch (evt.key) {
      case PlationTypeEnum.TITOK:
        addTitokAccount();
        break;
      // case PlationTypeEnum.BILIBILI:
      //   break;
      default:
        createMessage.warning('暂不支持该平台账号添加');
    }
  };

  /**
   * 添加抖音账号
   */
  const addTitokAccount = async () => {
    try {
      globalLoading.open();
      const userInfo = await accountLogin('titok');
      // window.darkMode.toggle('tttt');
      await localforage.setItem(String(userInfo.accountId), userInfo);
      console.log(userInfo);
      createMessage.warning('新增账号成功');
      nextTick(() => {
        // fetchTableData();
        tableMethod.reload();
      });
    } catch (err) {
      console.log(err);
      createMessage.warning('新增账号失败');
    } finally {
      globalLoading.close();
    }
  };
</script>
