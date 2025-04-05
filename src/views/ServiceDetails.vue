<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Cloud Service Details</h1>
      <div class="space-x-4">
        <router-link 
          :to="`/services/edit/${service?.id}`"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          v-if="service"
        >
          Edit
        </router-link>
        <router-link 
          to="/services"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to List
        </router-link>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="!service" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Service not found</h3>
      <p class="mt-1 text-sm text-gray-500">The service you're looking for doesn't exist.</p>
      <div class="mt-6">
        <router-link 
          to="/services"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          View All Services
        </router-link>
      </div>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ service.serviceName }}
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          {{ service.description || 'No description provided' }}
        </p>
      </div>
      <div class="px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <!-- Status -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                service.status === 'Running' ? 'bg-green-100 text-green-800' :
                service.status === 'Deploying' ? 'bg-blue-100 text-blue-800' :
                service.status === 'Stopped' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`">
                {{ service.status }}
              </span>
            </dd>
          </div>
          
          <!-- Instance Type -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Instance Type</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ service.instanceType }}</dd>
          </div>
          
          <!-- Region -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Region</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ service.region }}</dd>
          </div>
          
          <!-- Resources -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Resources</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ service.vCPU }} vCPU, {{ service.memory }} GB Memory, {{ service.storage }} GB Storage
            </dd>
          </div>
          
          <!-- Network -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Network</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <p>VPC: {{ service.vpc }}</p>
              <p>Subnet: {{ service.subnet }}</p>
              <p>Public IP: {{ service.assignPublicIP ? 'Enabled' : 'Disabled' }}</p>
            </dd>
          </div>
          
          <!-- Security Groups -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Security Groups</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <ul class="list-disc pl-5">
                <li v-for="group in service.securityGroups" :key="group">{{ group }}</li>
              </ul>
            </dd>
          </div>
          
          <!-- Created -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Created</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ new Date(service.createdAt).toLocaleString() }}
            </dd>
          </div>
          
          <!-- Last Updated -->
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ new Date(service.updatedAt).toLocaleString() }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useServicesStore } from '../store/services';
import { storeToRefs } from 'pinia';

const route = useRoute();
const servicesStore = useServicesStore();

const isLoading = ref(true);
const { currentService: service } = storeToRefs(servicesStore);

onMounted(async () => {
  try {
    await servicesStore.loadServices();
    servicesStore.setCurrentServiceById(route.params.id as string);
  } catch (error) {
    console.error('Failed to load service details:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>