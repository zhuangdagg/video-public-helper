<template>
  <PageWrapper class="platform-video-download" fixedHeight>
    <h1 class="head"
      >下载 Twitter 视频
      <Tooltip>
        <template #title>
          <ul>
            <li>1. 需要搭建能访问 twitter 的网络环境</li>
            <li>2. 需要下载安装ffmpeg软件</li>
          </ul>
        </template>
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
    <div class="platform-save-path">
      <span class="label">视频保存至：</span>
      <span class="path">{{ videoInfo.saveDir }}</span>
      <Icon @click="onSavePathChange" icon="clarity:note-edit-line" />
    </div>

    <!-- 日志信息· -->
    <Textarea
      v-if="videoInfo.log"
      class="log-block"
      disabled
      :rows="10"
      :autosize="false"
      :value="videoInfo.log"
    ></Textarea>

    <div class="donwload-info" v-if="videoInfo.saveFile">
      <div><Icon class="down-icon-success" icon="material-symbols:download" />下载完成</div>
      <div
        >{{ videoInfo.saveFile }}
        <Icon icon="ion:open-outline" title="在文件夹打开" @click="openFileInDirectory" />
      </div>
      <Button type="primary" class="m-3" @click="toPublishPage">发布该视频</Button>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { InputSearch, Textarea, Tooltip, Button } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import Icon from '@/components/Icon/Icon.vue';

  import { reactive, onMounted } from 'vue';

  import { useMessage } from '@/hooks/web/useMessage';
  import { useIPC } from '@/hooks/web/useIPC';
  import { useRouter } from 'vue-router';

  defineOptions({ name: 'VideoDownload' });

  const videoInfo = reactive({
    downloadUrl: '',
    loading: false,
    saveFile: '',
    saveDir: '',
    log: ``,
  });

  const { createMessage } = useMessage();
  const { directorySelect, systemInfo, openFile, onLog, downloadVideo } = useIPC();
  const router = useRouter();

  onMounted(() => {
    systemInfo.getEnv().then((res) => {
      if (res && res.videoAppData) {
        videoInfo.saveDir = res.videoAppData;
      }
    });
  });

  const onVideoSearch = async (downloadUrl: string) => {
    videoInfo.saveFile = '';
    videoInfo.log = '';
    if (!videoInfo.downloadUrl) {
      createMessage.warning('请输入下载链接');
      return;
    }
    let offLog: Function;
    try {
      videoInfo.loading = true;
      offLog = onLog('video-download-log', (evt, msg) => {
        console.log('video-download-log: ', msg);
        videoInfo.log += msg + '\n';
      });
      videoInfo.saveFile = await downloadVideo({
        downloadUrl: videoInfo.downloadUrl,
        saveDir: videoInfo.saveDir,
      });
    } catch (err) {
      console.log(err);
    } finally {
      videoInfo.loading = false;
      offLog?.();
    }
  };

  const onSavePathChange = async () => {
    const result = await directorySelect();
    if (result.canceled) return;
    if (result.filePaths.length) {
      videoInfo.saveDir = result.filePaths[0];
    }
    console.log(result);
  };

  const openFileInDirectory = async () => {
    openFile(videoInfo.saveFile);
  };

  const toPublishPage = async () => {
    router.push({
      name: 'ContentPublish',
      query: {
        file: videoInfo.saveFile,
      },
    });
  };
</script>

<style lang="less">
  .platform-video-download {
    text-align: center;
    // border: 1px solid;

    .app-iconify {
      cursor: pointer;
      color: @primary-color;
      padding: 0 10px;
      font-size: 18px;

      :hover {
        color: lighten(@primary-color, 20%);
      }
    }
    .head {
      color: @primary-color;
      margin: 30px 0;
      font-size: 26px;
      font-weight: 600;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .platform-save-path {
      margin: 0px auto 0;
      padding: 0 10px;
      width: 70%;
      text-align: start;
      // height: 40px;
      line-height: 40px;
      > .label {
        color: rgba(0, 0, 0, 0.4);
      }
    }

    .log-block {
      width: 70%;
    }

    .donwload-info {
      margin-top: 20px;
      > :nth-child(1) {
        margin-top: 10px;
        color: @primary-color;
        font-size: 26px;
        font-weight: 500px;
      }

      > :nth-child(1) {
        margin: 10px;
        color: @primary-color;
      }
    }

    .search-input-bar {
      width: 70%;
    }
  }
</style>
