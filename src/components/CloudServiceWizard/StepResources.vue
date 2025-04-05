<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">Resource Configuration</h3>
    <p class="text-gray-600 mb-6">Configure the compute resources for your service.</p>

    <div class="space-y-6">
      <!-- Instance Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Instance Type *</label>
        <div class="flex flex-col w-fit">
          <div
            v-for="type in instanceTypes"
            :key="type.value"
            class="p-4 cursor-pointer"
            @click="setFieldValue('instanceType', type.value)"
          >
            <div class="flex items-center">
              <input
                type="radio"
                :id="`instance-${type.value}`"
                :value="type.value"
                v-model="values.instanceType"
                class="h-4 w-4"
              />
              <label :for="`instance-${type.value}`" class="ml-3 block text-sm font-medium text-gray-700">
                {{ type.label }}
              </label>
            </div>
            <p class="mt-1 ml-7 text-sm text-gray-500">{{ type.description }}</p>
          </div>
        </div>
        <ErrorMessage name="instanceType" class="mt-1 text-sm text-red-600" />
      </div>

      <div class="flex items-center w-full gap-3">
        <!-- vCPU -->
        <div class="w-full">
          <label for="vCPU" class="block text-sm font-medium text-gray-700">vCPU *</label>
          <Field
            id="vCPU"
            name="vCPU"
            type="number"
            min="1"
            max="32"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <ErrorMessage name="vCPU" class="mt-1 text-sm text-red-600" />
        </div>
        <!-- Memory -->
        <div class="w-full">
          <label for="memory" class="block text-sm font-medium text-gray-700">Memory (GB) *</label>
          <Field
            id="memory"
            name="memory"
            type="number"
            min="1"
            max="256"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <ErrorMessage name="memory" class="mt-1 text-sm text-red-600" />
        </div>
        <!-- Storage -->
        <div class="w-full">
          <label for="storage" class="block text-sm font-medium text-gray-700">Storage (GB) *</label>
          <Field
            id="storage"
            name="storage"
            type="number"
            min="10"
            max="2000"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <ErrorMessage name="storage" class="mt-1 text-sm text-red-600" />
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <button
        type="button"
        @click="$emit('back')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Back
      </button>
      <button
        type="button"
        @click="validateAndNext"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage, useForm } from 'vee-validate';
import type { CloudServiceForm } from '../../types/cloud-service';

// Define emits with TypeScript
const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'back'): void;
}>();

// Use vee-validate's useForm instead of Formik's useFormikContext
const { values, setFieldValue, validate } = useForm<CloudServiceForm>();

const instanceTypes = [
  {
    value: 'Standard',
    label: 'Standard (General Purpose)',
    description: 'Balanced compute, memory, and networking'
  },
  {
    value: 'Compute Optimized',
    label: 'Compute Optimized',
    description: 'High performance processors'
  },
  {
    value: 'Memory Optimized',
    label: 'Memory Optimized',
    description: 'Fast performance for memory-intensive workloads'
  },
  {
    value: 'Storage Optimized',
    label: 'Storage Optimized',
    description: 'Low latency, high disk throughput'
  }
] as const;

const validateAndNext = async () => {
  const { valid } = await validate();
  if (valid) {
    emit('next');
  }
};
</script>
