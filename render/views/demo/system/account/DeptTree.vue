<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="部门列表"
      toolbar
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="deptStore.departmentTree"
      :fieldNames="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '@/components/Tree';
  import { useDepartmentStore } from '@/store/modules/system/department';

  defineOptions({ name: 'DeptTree' });
  const deptStore = useDepartmentStore();

  const emit = defineEmits(['select']);

  async function fetch() {
    // treeData.value = (await getDeptList()) as unknown as TreeItem[];
  }

  function handleSelect(keys) {
    emit('select', keys[0]);
  }

  onMounted(() => {
    fetch();
  });
</script>
