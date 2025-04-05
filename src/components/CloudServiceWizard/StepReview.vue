<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">Review Configuration</h3>
    <p class="text-gray-600 mb-6">Please review your service configuration before deployment.</p>
    
    <div class="bg-gray-50 p-6 rounded-lg">
      <h4 class="text-md font-medium text-gray-900 mb-4">Service Summary</h4>
      
      <!-- Cover Image -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Cover image</label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Service Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 class="text-sm font-medium text-gray-500">Service Name</h5>
          <p class="mt-1 text-sm text-gray-900">{{ values.serviceName }}</p>
        </div>
        
        <div>
          <h5 class="text-sm font-medium text-gray-500">Description</h5>
          <p class="mt-1 text-sm text-gray-900">{{ values.description || 'No description' }}</p>
        </div>
        
        <div>
          <h5 class="text-sm font-medium text-gray-500">Region</h5>
          <p class="mt-1 text-sm text-gray-900">{{ values.region }}</p>
        </div>
        
        <div>
          <h5 class="text-sm font-medium text-gray-500">Instance Type</h5>
          <p class="mt-1 text-sm text-gray-900">{{ values.instanceType }}</p>
        </div>
        
        <div>
          <h5 class="text-sm font-medium text-gray-500">Resources</h5>
          <p class="mt-1 text-sm text-gray-900">
            {{ values.vCPU }} vCPU, {{ values.memory }} GB Memory, {{ values.storage }} GB Storage
          </p>
        </div>
        
        <div>
          <h5 class="text-sm font-medium text-gray-500">Network</h5>
          <p class="mt-1 text-sm text-gray-900">
            VPC: {{ values.vpc }}<br>
            Subnet: {{ values.subnet }}<br>
            Public IP: {{ values.assignPublicIP ? 'Yes' : 'No' }}
          </p>
        </div>
        
        <div>
          <h5 class="text-sm font-medium text-gray-500">Security Groups</h5>
          <ul class="mt-1 text-sm text-gray-900 list-disc list-inside">
            <li v-for="group in values.securityGroups" :key="group">{{ group }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <p class="text-sm text-gray-600 mb-4">
        Your service is ready for deployment. Click the Deploy button below to start the deployment process.
      </p>
      
      <div class="flex justify-between">
        <button 
          type="button" 
          @click="$emit('back')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <div class="space-x-3">
          <button 
            type="button" 
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Deploy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import type { CloudServiceForm } from '../../types/cloud-service';

// Define emits with TypeScript
const emit = defineEmits<{
  (e: 'back'): void;
}>();

// Use vee-validate's useForm instead of Formik's useFormikContext
const { values } = useForm<CloudServiceForm>();
</script>