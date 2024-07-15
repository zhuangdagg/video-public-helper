<template>
  <PageWrapper contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          :loading="flag.syncLoading"
          type="primary"
          title="获取非本地授权的账号信息"
          @click="asyncAccoount"
        >
          同步账号
        </a-button>
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
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                ifShow: !!record.status,
                icon: 'material-symbols:login',
                tooltip: '重新登录',
                onClick: () => {
                  handleCreate({ key: record.accountType } as any)
                }
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction, ActionItem } from '@/components/Table';
  import { useData } from './account.data';
  import Icon from '@/components/Icon/Icon.vue';
  import { Dropdown, Menu, MenuItem, message } from 'ant-design-vue';

  import { PlationTypeEnum, PlationNames } from '@/enums/plationAccountEnum';
  import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';

  import { useMessage } from '@/hooks/web/useMessage';
  import { createLoading } from '@/components/Loading';
  import { useLocalforage } from '@/hooks/web/useLocalforage';
  import { useIPC } from '@/hooks/web/useIPC';
  import { useVideoPublishStore } from '@/store/modules/video-publish';
  import { ref, reactive, onMounted, nextTick, computed } from 'vue';

  const { columns, formSchemas } = useData();
  const { createMessage } = useMessage();
  const { accountForage } = useLocalforage();
  const { accountLogin } = useIPC();
  const { accountAdd } = useVideoPublishStore();
  const globalLoading = createLoading({ tip: '请在浏览器完成登录操作' });
  defineOptions({ name: 'plationAccountManage' });

  const flag = reactive({
    syncLoading: false,
    lastsyncTime: 0,
  });

  const fetchTableData = () => {
    return new Promise((resolve, reject) => {
      const _list: any = [];
      accountForage
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
      await accountForage.setItem(String(userInfo.accountId), userInfo);
      console.log(userInfo);
      // await accountAdd(userInfo);
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

  /**
   * 同步账号
   */
  const asyncAccoount = () => {
    if (flag.lastsyncTime && Date.now() - flag.lastsyncTime < 60000) {
      createMessage.warning('频繁同步操作');
      return;
    }
    flag.syncLoading = true;
    setTimeout(() => {
      createMessage.success('同步成功');
      flag.syncLoading = false;
      flag.lastsyncTime = Date.now();
    }, 4000);
  };

  const handleDelete = async (record: any) => {
    console.log(record);
    await accountForage.removeItem(record.accountId);

    nextTick(() => {
      // fetchTableData();
      tableMethod.reload();
    });
  };
</script>
