<template>
  <Icon v-bind="$attrs" />
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import { defineOptions } from 'vue';

  defineOptions({ name: 'Icon' });

  const props = withDefaults(
    defineProps<{
      size?: string | number;
      spin?: boolean;
      prefix?: string;
    }>(),
    {
      size: 16,
      spin: false,
      prefix: '',
    },
  );
</script>
