<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">Resource Configuration</h3>
    <p class="text-gray-600 mb-6">Configure the compute resources for your service.</p>

    <div class="space-y-6">
      <!-- Instance Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Instance Type <span class="text-red-400 ml-2">*</span></label>
        <div class="flex flex-col w-fit">
          <div
            v-for="type in instanceTypes"
            :key="type.value"
            class="md:p-4 py-4 cursor-pointer"
            @click="handleChange('instanceType', type.value)"
          >
            <div class="flex items-center">
              <input
                type="radio"
                :id="`instance-${type.value}`"
                :value="type.value"
                :checked="props.values.instanceType === type.value"
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

      <div class="flex flex-col md:flex-row items-center w-full gap-3">
        <!-- vCPU -->
        <div class="w-full">
          <label for="vCPU" class="block text-sm font-medium text-gray-700">vCPU <span class="text-red-400 ml-2">*</span></label>
          <Field
            id="vCPU"
            name="vCPU"
            type="number"
            min="1"
            max="32"
            :value="props.values.vCPU"
            @input="handleChange('vCPU', $event)"
            class="mt-1 block w-full shadow rounded-md py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <ErrorMessage name="vCPU" class="mt-1 text-sm text-red-600" />
        </div>
        <!-- Memory -->
        <div class="w-full">
          <label for="memory" class="block text-sm font-medium text-gray-700">Memory (GB) <span class="text-red-400 ml-2">*</span></label>
          <Field
            id="memory"
            name="memory"
            type="number"
            min="1"
            max="256"
            :value="props.values.memory"
            @input="handleChange('memory', $event)"
            class="mt-1 block w-full rounded-md shadow py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <ErrorMessage name="memory" class="mt-1 text-sm text-red-600" />
        </div>
        <!-- Storage -->
        <div class="w-full">
          <label for="storage" class="block text-sm font-medium text-gray-700">Storage (GB) <span class="text-red-400 ml-2">*</span></label>
          <Field
            id="storage"
            name="storage"
            type="number"
            min="10"
            max="2000"
            :value="props.values.storage"
            @input="handleChange('storage', $event)"
            class="mt-1 block w-full rounded-md shadow py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <ErrorMessage name="storage" class="mt-1 text-sm text-red-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import type { CloudServiceForm } from '../../types/cloud-service';

// Define props for values and errors
const props = defineProps<{
  values: CloudServiceForm;
  errors: Record<string, string>;
}>();

// Define emits for field updates
const emit = defineEmits<{
  (e: 'update:field', field: keyof CloudServiceForm, value: any): void;
}>();

const instanceTypes = [
  {
    value: 'Standard',
    label: 'Standard (General Purpose)',
    description: 'Balanced compute, memory, and networking',
  },
  {
    value: 'Compute Optimized',
    label: 'Compute Optimized',
    description: 'High performance processors',
  },
  {
    value: 'Memory Optimized',
    label: 'Memory Optimized',
    description: 'Fast performance for memory-intensive workloads',
  },
  {
    value: 'Storage Optimized',
    label: 'Storage Optimized',
    description: 'Low latency, high disk throughput',
  },
] as const;

// Function to handle changes to form fields
const handleChange = (field: keyof CloudServiceForm, value: any) => {
  // For input events, extract the value from the event object
  if (value instanceof Event) {
    const target = (value as Event).target as HTMLInputElement;
    const newValue = field === 'instanceType' ? target.value : Number(target.value);
    emit('update:field', field, newValue);
  } else {
    // For direct values (e.g., instanceType from radio buttons)
    emit('update:field', field, value);
  }
};
</script>