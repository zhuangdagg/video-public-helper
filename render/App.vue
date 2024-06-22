<template>
  <ConfigProvider>
    <Button>ant design btn</Button>
    <!-- <RouterView /> -->
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { ConfigProvider, Button } from 'ant-design-vue';

  //   import { }

  const toggleTheme = async () => {
    const theme = await window.darkMode.toggle();

    console.log({ theme });
  };

  const followSystem = async () => {
    await window.darkMode.system();

    console.log('system');
  };
</script>

<style lang="less">
  h1 {
    color: red;
  }
</style>
