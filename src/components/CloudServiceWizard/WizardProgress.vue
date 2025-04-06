<template>
  <div class="py-6">
    <div class="flex flex-col md:flex-row gap-8 mt-4 h-full">
      <div v-for="(step, index) in steps" :key="index" class="mb-4 md:mb-0">
        <div
          :class="[
            'flex flex-col items-center w-[210px] text-left h-[76px] md:h-full gap-2 border-l-4 md:pt-2 md:border-l-0 pl-3 md:pl-0 md:border-t-4',
            currentStep >= index ? 'border-[#2563EB]' : 'border-gray-300',
          ]"
        >
          <div class="flex flex-col items-center mt-2 w-full">
            <div
              :class="[
                'flex items-center w-full text-left',
                currentStep >= index ? 'text-blue-600' : 'text-gray-400',
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

    <div class="mt-6">
      <slot name="content">
        <p class="text-gray-600">Content for step {{ currentStep + 1 }} goes here.</p>
      </slot>
    </div>
    <div class="mt-8 flex justify-between">
      <button
        type="button"
        @click="emit('back')"
        :disabled="currentStep === 0"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>
      <button
        v-if="currentStep < steps.length - 1"
        type="button"
        @click="emit('next')"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Next
      </button>
      <button
        v-else
        type="submit"
        @click="onSubmit"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Deploy
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number;
  steps: Array<{ title: string; subtitle: string; component?: any }>;
  onSubmit?: (values: any) => void;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'back'): void;
}>();
</script>