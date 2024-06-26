<template>
  <div class="plation-account-manage">
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
  </div>
</template>

<script setup lang="ts">
  // import { defineOption } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { useData } from './account.data';
  import Icon from '@/components/Icon/Icon.vue';
  import { Dropdown, Menu, MenuItem } from 'ant-design-vue';

  import { PlationTypeEnum, PlationNames } from '@/enums/plationAccountEnum';
  import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';

  import { useMessage } from '@/hooks/web/useMessage';
  import { createLoading } from '@/components/Loading';

  const { columns, formSchemas } = useData();
  const { createMessage } = useMessage();
  const globalLoading = createLoading({ tip: '请在浏览器完成登录操作' });
  defineOptions({ name: 'plationAccountManage' });

  const [registerTable, tablrMethod] = useTable({
    title: '账号列表',
    columns,
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: formSchemas,
    },
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
      const userInfo = await window.playwright.login('titok');
      // window.darkMode.toggle('tttt');
      console.log(userInfo);
      createMessage.warning('新增账号成功');
    } catch (err) {
      console.log(err);
      createMessage.warning('新增账号失败');
    } finally {
      globalLoading.close();
    }
  };
</script>
