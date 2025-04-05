<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">Service Basics</h3>
    <p class="text-gray-600 mb-6">Provide basic information about your cloud service.</p>

    <div class="space-y-6">
      <!-- Cover Image Upload -->
      <div class="flex items-center space-x-4">
        <div class="flex justify-center items-center rounded-lg w-[100px] h-[100px] text-[#6B7280] bg-[#F3F4F6]">
          <div class="space-y-1 text-center">
            <img src="@/assets/icons/image-outline.svg" alt="image Icon" class="mx-auto text-gray-400" />

            <div class="flex text-sm text-nowrap">
              <label class="relative cursor-pointer rounded-md font-medium">
                <span>Cover image</span>
                <input type="file" class="sr-only" @change="handleFileUpload" />
              </label>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center rounded-lg w-[40px] h-[40px]  border border-[#F3F4F6]">
          <img src="@/assets/icons/upload.svg" alt="image Icon" class="mx-auto text-gray-400" />
        </div>
        <div class="flex justify-center items-center rounded-lg w-[40px] h-[40px]  border border-[#F3F4F6]">
          <img src="@/assets/icons/delete.svg" alt="image Icon" class="mx-auto text-gray-400" />
        </div>
      </div>

      <!-- Service Name -->
      <div>
        <label for="serviceName" class="block text-sm font-medium text-gray-700">Service Name *</label>
        <Field
          id="serviceName"
          name="serviceName"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage name="serviceName" class="mt-1 text-sm text-red-600" />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <Field
          id="description"
          name="description"
          as="textarea"
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage name="description" class="mt-1 text-sm text-red-600" />
      </div>

      <!-- Region -->
      <div>
        <label for="region" class="block text-sm font-medium text-gray-700">Region *</label>
        <Field
          id="region"
          name="region"
          as="select"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option>US West (N. California)</option>
          <option>US East (N. Virginia)</option>
          <option>Europe (Ireland)</option>
          <option>Asia Pacific (Tokyo)</option>
        </Field>
        <ErrorMessage name="region" class="mt-1 text-sm text-red-600" />
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <button
        type="button"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled
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

// Use vee-validate's useForm
const { validate, setFieldValue } = useForm<CloudServiceForm>();

const validateAndNext = async () => {
  const { valid } = await validate();
  if (valid) {
    emit('next');
  }
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    // You can handle the file upload here or set it in the form
    // Example: setFieldValue('coverImage', file);
  }
};
</script>
