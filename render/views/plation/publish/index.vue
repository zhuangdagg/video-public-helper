<template>
  <PageWrapper class="content-publish" title="内容发布" content="目前支持抖音平台多账户视频发布">
    <Card title="上传视频" :bordered="false">
      <UploadDragger
        v-model:fileList="fileList"
        accept="video/*"
        :beforeUpload="beforeUpload"
        @remove="removeFile"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或拖拽文件上传</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or
          other band files
        </p>
      </UploadDragger>
    </Card>
    <Card title="内容编辑" :bordered="false" class="!mt-5">
      <BasicForm @register="formRegister" />
    </Card>
    <Card title="发布账号" :bordered="false" class="!mt-5">
      <accountTable ref="accountTableRef" />
    </Card>
    <template #rightFooter>
      <a-button type="primary" @click="handlePublish">发布</a-button>
    </template>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { Card, UploadDragger } from 'ant-design-vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import { PageWrapper } from '@/components/Page';
  import { BasicForm, useForm } from '@/components/Form';
  import accountTable from './component/accountTable.vue';
  import { ref, unref, onMounted } from 'vue';

  // data
  import { useData } from './publish.data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useIPC } from '@/hooks/web/useIPC';
  import { createLoading } from '@/components/Loading';
  import { useLocalforage } from '@/hooks/web/useLocalforage';
  import { useRoute, useRouter } from 'vue-router';

  import type { UploadProps } from 'ant-design-vue';
  import type { VideoPublishInfo, VideoPublishResult } from '#/video-plation-publish';

  defineOptions({ name: 'ContentPublish' });

  const { schemas } = useData();
  const { plationPublish } = useIPC();
  const { createMessage } = useMessage();
  const { publishRecordForage } = useLocalforage();
  const route = useRoute();
  const router = useRouter();
  const accountTableRef = ref<any>(null);
  const fileList = ref<UploadProps['fileList']>([]);

  const globalLoading = createLoading({ tip: '发布中，请勿进行任何操作！' });
  const [formRegister, formMethod] = useForm({
    // layout: 'vertical',
    baseColProps: {
      span: 20,
    },
    schemas,
    showActionButtonGroup: false,
  });

  onMounted(() => {
    const _path = route.query?.file;
    console.log(_path);
    if (_path) {
      fileList.value = [
        {
          uid: _path,
          name: _path,
          fileName: _path,
          originFileObj: {
            path: _path,
          },
        },
      ] as any;
    }
  });

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    fileList.value = [file];

    return false;
  };
  const removeFile: UploadProps['onRemove'] = () => {
    fileList.value = [];
  };

  const handlePublish = () => {
    if (!unref(fileList).length) {
      createMessage.error('请上传视频');
      return;
    }
    const account = unref(accountTableRef).getAccouont();
    if (!account.length) {
      createMessage.error('请选择上传账号');
      return;
    }
    let publishInfo: VideoPublishInfo;
    const filePath = unref(fileList)[0].originFileObj?.path;
    formMethod
      .validate()
      .then((form) => {
        const { title, desc } = form;
        publishInfo = {
          title,
          desc,
          filePath,
          fileType: 'video',
          account,
        };

        console.log({ publishInfo });
        globalLoading.open();
        return plationPublish(publishInfo);
      })
      .then((result) => {
        createMessage.success('发布操作完成');
        console.log({ result });
        savePublishRecord(result);
      }, console.error)
      .finally(() => {
        globalLoading.close();
      });
  };

  const savePublishRecord = async (result: VideoPublishResult[] = []) => {
    await Promise.all(
      result.map((info) => {
        publishRecordForage.setItem(info.publishId, info);
      }),
    );

    router.push({ name: 'PublishRecord' });
  };
</script>

<style lang="less" scoped>
  .content-publish {
    padding-bottom: 48px;
  }
</style>
