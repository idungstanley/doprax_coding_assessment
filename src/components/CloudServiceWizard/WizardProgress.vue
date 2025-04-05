<template>
  <div class="py-6">
    <div class="flex flex-col md:flex-row gap-8 mt-4">
      <div v-for="(step, index) in steps" :key="index" class="mb-4 md:mb-0">
        <div class="flex flex-col items-center w-[210px] text-left">
          <div :class="['h-1 w-full', currentStep >= index ? 'bg-blue-600' : 'bg-gray-300']"></div>
          <div class="flex flex-col items-center mt-2 w-full">
            <div
              :class="[
                'flex items-center w-full text-left',
                currentStep >= index
                  ? 'text-blue-600'
                  : 'text-gray-400'
              ]"
            >
              Step {{ index + 1 }}
            </div>
            <span class="text-sm w-full text-black font-medium">
              {{ step.title }}
            </span>
            <span class="text-sm text-[#6B7280] w-full">
              {{ step.subtitle }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentStep: {
    type: Number,
    required: true
  }
});

const steps = [
  { title: 'Service Basics', subtitle: 'Define your service details' },
  { title: 'Resources', subtitle: 'Configure compute resources' },
  { title: 'Network', subtitle: 'Set up network configuration' },
  { title: 'Review', subtitle: 'Review and deploy' }
];
</script>
