<template>
  <PageWrapper class="platform-video-download" fixedHeight>
    <h1 class="head"
      >下载 Twitter 视频
      <Tooltip>
        <template #title>需要搭建能访问 twitter 的网络环境</template>
        <Icon icon="fe:warning" />
      </Tooltip>
    </h1>
    <InputSearch
      class="search-input-bar"
      v-model:value="videoInfo.downloadUrl"
      :loading="videoInfo.loading"
      placeholder="输入 Twitter 视频分享 URL，格式：https://x.com/user/status/xxx"
      allowClear
      size="large"
      enter-button="下载"
      @search="onVideoSearch"
    />
    <ul>
      <li>下载高清</li>
      <li>下载普通</li>
      <li>{{ videoInfo.saveFile }}</li>
    </ul>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { InputSearch, Button, Tooltip } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import Icon from '@/components/Icon/Icon.vue';

  import { reactive } from 'vue';

  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({ name: 'VideoDownload' });

  const videoInfo = reactive({
    downloadUrl: 'https://x.com/TheFigen_/status/1811155033259450467',
    loading: false,
    saveFile: '',
  });

  const { createMessage } = useMessage();

  const onVideoSearch = async (downloadUrl: string) => {
    console.log({ downloadUrl });
    if (!videoInfo.downloadUrl) {
      createMessage.warning('请输入下载链接');
      return;
    }
    try {
      videoInfo.loading = true;
      videoInfo.saveFile = await window.videoDownload.download(videoInfo.downloadUrl);
    } catch (err) {
      console.log(err);
    } finally {
      videoInfo.loading = false;
    }
  };
</script>

<style lang="less">
  .platform-video-download {
    color: @primary-color;
    text-align: center;
    // border: 1px solid;
    .head {
      margin: 30px 0;
      font-size: 26px;
      font-weight: 600;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .search-input-bar {
      width: 70%;
    }
  }
</style>
