<template>
  <PageWrapper title="上传组件示例">
    <Alert message="基础示例" />
    <BasicUpload
      :maxSize="20"
      :maxNumber="10"
      @change="handleChange"
      :api="uploadApi"
      class="my-5"
      :accept="['image/*']"
    />

    <Alert message="嵌入表单,加入表单校验" />

    <BasicForm @register="register" class="my-5" />

    <Alert message="大文件分片上传示例" />
    <Upload v-model:fileList="fileList" 
      
      :before-upload="beforeUpload"
      >
      <Button>大文件上传</Button>
    </Upload>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicUpload } from '@/components/Upload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { PageWrapper } from '@/components/Page';
  import { Alert, Upload, Button } from 'ant-design-vue';
  import { uploadApi, multipartUpload, uploadComplete } from '@/api/sys/upload';
  import { getLargeFileHash } from '@/utils/cipher'

  const fileList = ref<any>([]);

  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Upload',
      label: '字段1',
      colProps: {
        span: 8,
      },
      rules: [{ required: true, message: '请选择上传文件' }],
      componentProps: {
        api: uploadApi,
      },
    },
  ];
  const { createMessage } = useMessage();
  const [register] = useForm({
    labelWidth: 120,
    schemas,
    actionColOptions: {
      span: 16,
    },
  });

  function handleChange(list: string[]) {
    createMessage.info(`已上传文件${JSON.stringify(list)}`);
  }

  const beforeUpload = async (file: File, fileList) => {
    console.log({ file, fileList}, '--before upload')
    const hash = await getLargeFileHash(file)
    console.log({ hash })
    multipartUpload({
      bucketName: 'videos',
      objectName: hash + '.mp4'
    }).then((res: any) => {
      const { url, etags = [], uploadId, bucketName, objectName } = res

      if(url) {
        // 秒传
        console.log('文件已存在', url)
        return
      }
      if(uploadId) {
        fileByFileUpload(file, bucketName, objectName, uploadId, etags)

        
      }

      // uploadApi({
      //   data: res,
      //   file: file.slice(0, 6 * 1e6)
      // }, () => {})
    })
    return false
  }
  // 断点续传
  const fileByFileUpload = async (file: File, bucketName, objectName, uploadId, etags) => {
    const chunkSize = 6 * 1e6;
    let index = 1;
    let start = 0, end = index * chunkSize;
    const fileSize = file.size;
    while(end < fileSize) {
      if(true || !etags.find(item => item.part === index)) {
        await uploadApi({
          data: {
            bucketName, objectName, uploadId, partNumber: index
          },
          file: file.slice(start, end)
        }, () => {})
        console.log(index, '--finished')
      }

      index++;
      start = end;
      end += chunkSize;
      if(fileSize - end < chunkSize) {
        end = fileSize
      }
    }

    // 合并请求
    
    uploadComplete({bucketName, objectName, uploadId })
      .then(res => {
        console.log('合并完成', res)
      })
    return true
  }
</script>
