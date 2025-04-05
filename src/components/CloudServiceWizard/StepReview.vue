<template>
  <div class="text-xs text-[#6B7280] pt-4">
    <div class="flex items-center mb-4 gap-2 text-[#111827] text-base">
      <img src="@/assets/icons/check.svg" alt="check icon" />
      <h3 class="font-medium">Review Configuration</h3>
    </div>
    <p class="mb-6">Please review your service configuration before deployment.</p>

    <div class="bg-[#F9FAFB] rounded-lg">
      <h4 class="text-base font-medium text-[#111827] mb-4 border-b border-[#E5E7EB] p-6">Service Summary</h4>

      <!-- Cover Image -->
      <div class="mb-6 flex flex-col md:flex-row border-b border-[#E5E7EB] p-6">
        <label class="block text-sm font-medium text-gray-700 mb-1 md:w-1/3 w-full">Cover image</label>
        <div class="mt-1 flex justify-center items-center px-6 pt-5 pb-6 bg-gray-200 rounded-md w-[100px] h-[100px]">
          <div class="space-y-1 text-center">
            <div v-if="imageUrl" class="w-full h-full">
              <img :src="imageUrl" alt="Selected Cover Image" class="w-full h-full object-cover rounded-lg" />
            </div>
            <div v-else>
              <img src="@/assets/icons/image-outline.svg" alt="image Icon" class="mx-auto text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Service Details -->
      <div class="flex flex-col gap-2">
        <div class="border-b border-[#E5E7EB] p-6 flex flex-col md:flex-row">
          <h5 class="text-sm font-medium text-gray-500 md:w-1/3 w-full">Service Name</h5>
          <p class="mt-1 text-sm text-gray-900">{{ props.values.serviceName }}</p>
        </div>

        <div class="border-b border-[#E5E7EB] p-6 flex flex-col md:flex-row">
          <h5 class="text-sm font-medium text-gray-500 md:w-1/3 w-full">Description</h5>
          <p class="mt-1 text-sm text-gray-900">{{ props.values.description || 'No description' }}</p>
        </div>

        <div class="border-b border-[#E5E7EB] p-6 flex flex-col md:flex-row">
          <h5 class="text-sm font-medium text-gray-500 md:w-1/3 w-full">Region</h5>
          <p class="mt-1 text-sm text-gray-900">{{ props.values.region }}</p>
        </div>

        <div class="border-b border-[#E5E7EB] p-6 flex flex-col md:flex-row">
          <h5 class="text-sm font-medium text-gray-500 md:w-1/3 w-full">Instance Type</h5>
          <p class="mt-1 text-sm text-gray-900">{{ props.values.instanceType }}</p>
        </div>

        <div class="border-b border-[#E5E7EB] p-6 flex flex-col md:flex-row">
          <h5 class="text-sm font-medium text-gray-500 md:w-1/3 w-full">Resources</h5>
          <p class="mt-1 text-sm text-gray-900">
            {{ props.values.vCPU }} vCPU, {{ props.values.memory }} GB Memory, {{ props.values.storage }} GB Storage
          </p>
        </div>

        <div class="border-b border-[#E5E7EB] p-6 flex w-full flex-col md:flex-row">
          <h5 class="text-sm font-medium text-gray-500 md:w-1/3 w-full">Network</h5>
          <p class="mt-1 text-sm text-gray-900">
            VPC: {{ props.values.vpc || 'Not specified' }}<br />
            Subnet: {{ props.values.subnet || 'Not specified' }}<br />
            Public IP: {{ props.values.assignPublicIP ? 'Yes' : 'No' }}
          </p>
        </div>

        <div class="p-6 flex flex-col md:flex-row">
          <h5 class="text-sm font-medium text-gray-500 md:w-1/3 w-full">Security Groups</h5>
          <ul class="mt-1 text-sm text-gray-900 list-disc list-inside">
            <li v-for="group in props.values.securityGroups" :key="group">{{ group }}</li>
            <li v-if="!props.values.securityGroups.length">None selected</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="bg-[#EFF6FF] rounded-lg p-4 mb-14">
        <h3 class="text-[#1E40AF] font-medium">Ready to deploy</h3>
        <p class="text-[#1E3A8A]">
          Your service is ready for deployment. Click the Deploy button below to start the deployment process.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CloudServiceForm } from '../../types/cloud-service';

// Define props for values
const props = defineProps<{
  values: CloudServiceForm;
}>();

// Reactive variable to store the image URL for display
const imageUrl = ref<string | null>(null);

// Watch for changes in values.coverImage (e.g., when editing an existing service)
watch(
  () => props.values.coverImage,
  (newFile) => {
    if (newFile instanceof File) {
      // If a file is present, convert it to a URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(newFile);
    } else {
      imageUrl.value = null;
    }
  },
  { immediate: true } // Run immediately to handle initial value
);
</script>