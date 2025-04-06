<template>
  <header :class="['h-15 w-full', bgColor]">
    <div class="container px-4 py-4 pl-8 flex justify-between items-center">
      <h1 :class="['text-[16px] font-semibold', textColor]">
        <slot>Cloud Service Deployment</slot>
      </h1>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  bgColor?: string;
  textColor?: string;
}

withDefaults(defineProps<Props>(), {
  bgColor: 'bg-white',
  textColor: 'text-gray-800'
});
</script>

<style scoped>
header {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
