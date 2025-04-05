<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">Network Settings</h3>
    <p class="text-gray-600 mb-6">Configure the network settings for your cloud service.</p>
    
    <div class="space-y-6">
      <!-- VPC -->
      <div>
        <label for="vpc" class="block text-sm font-medium text-gray-700">Virtual Private Cloud (VPC) *</label>
        <Field 
          id="vpc" 
          name="vpc"
          as="select"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option>Development VPC</option>
          <option>Production VPC</option>
          <option>Staging VPC</option>
        </Field>
        <ErrorMessage name="vpc" class="mt-1 text-sm text-red-600" />
      </div>

      <!-- Subnet -->
      <div>
        <label for="subnet" class="block text-sm font-medium text-gray-700">Subnet *</label>
        <Field 
          id="subnet" 
          name="subnet"
          as="select"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option>Development Subnet (AZ-b)</option>
          <option>Production Subnet (AZ-a)</option>
          <option>Staging Subnet (AZ-c)</option>
        </Field>
        <ErrorMessage name="subnet" class="mt-1 text-sm text-red-600" />
      </div>

      <!-- Public IP -->
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <Field 
            id="assignPublicIP" 
            name="assignPublicIP"
            type="checkbox" 
            class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="assignPublicIP" class="font-medium text-gray-700">Assign public IP address</label>
          <p class="text-gray-500">Enable this to make your service accessible from the Internet</p>
        </div>
      </div>

      <!-- Security Groups -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Security Groups *</label>
        <div class="space-y-2">
          <div 
            v-for="group in securityGroups" 
            :key="group.value"
            class="flex items-start"
          >
            <div class="flex items-center h-5">
              <Field 
                :id="`securityGroup-${group.value}`" 
                name="securityGroups"
                :value="group.value"
                type="checkbox" 
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label :for="`securityGroup-${group.value}`" class="font-medium text-gray-700">{{ group.label }}</label>
              <p class="text-gray-500">{{ group.description }}</p>
            </div>
          </div>
        </div>
        <ErrorMessage name="securityGroups" class="mt-1 text-sm text-red-600" />
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

// Use vee-validate's useForm
const { validate } = useForm<CloudServiceForm>();

const securityGroups = [
  {
    value: 'Web Traffic (80, 443)',
    label: 'Web Traffic (80, 443)',
    description: 'Allow HTTP and HTTPS traffic'
  },
  {
    value: 'SSH Access (22)',
    label: 'SSH Access (22)',
    description: 'Allow SSH access'
  },
  {
    value: 'Database (3306, 5432)',
    label: 'Database (3306, 5432)',
    description: 'Allow MySQL and PostgreSQL access'
  },
  {
    value: 'Internal Only',
    label: 'Internal Only',
    description: 'Restrict to internal network only'
  }
] as const;

const validateAndNext = async () => {
  const { valid } = await validate();
  if (valid) {
    emit('next');
  }
};
</script>