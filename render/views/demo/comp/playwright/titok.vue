<template>
  <div>
    <h3>账号登录：</h3>
    <Button @click="login">登录titok</Button>
    <Button></Button>
  </div>
</template>

<script setup lang="ts">
  import { Button } from 'ant-design-vue';
  import { defineOptions } from 'vue';

  defineOptions({ name: 'titok' });

  const login = () => {
    window.playwright.login();
  };
</script>
