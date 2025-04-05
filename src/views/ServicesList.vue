<template>
  <div class="p-6 bg-white shadow rounded-lg w-full h-full">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-[17px] font-medium">Your Cloud Services</h1>
    </div>

    <div v-if="isLoading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="services.length === 0" class="text-center py-12">
      <img src="../assets/icons/cloud.svg" alt="Cloud Icon" class="mx-auto h-12 w-12 text-gray-400" />
      <!-- <CloudIcon class="w-6 h-6 mr-2 text-gray-600" /> -->

      <h3 class="mt-2 text-lg font-medium text-gray-900">No cloud services yet</h3>
      <p class="mt-1 text-sm text-gray-500">Click on the button below to create and manage a cloud service</p>
      <div class="mt-6">
        <router-link
          to="/services/create"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Cloud Service
        </router-link>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="service in services" :key="service.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between">
            <h3 class="text-lg font-medium text-gray-900">{{ service.serviceName }}</h3>
            <span
              :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                service.status === 'Running'
                  ? 'bg-green-100 text-green-800'
                  : service.status === 'Deploying'
                  ? 'bg-blue-100 text-blue-800'
                  : service.status === 'Stopped'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`"
            >
              {{ service.status }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500">{{ service.description || 'No description' }}</p>

          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Instance Type</p>
              <p class="text-sm font-medium">{{ service.instanceType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Region</p>
              <p class="text-sm font-medium">{{ service.region }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">vCPUs</p>
              <p class="text-sm font-medium">{{ service.vCPU }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Memory</p>
              <p class="text-sm font-medium">{{ service.memory }} GB</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-3 flex justify-between">
          <router-link :to="`/services/${service.id}`" class="text-sm font-medium text-blue-600 hover:text-blue-500">
            View Details
          </router-link>
          <div class="space-x-4">
            <router-link
              :to="`/services/edit/${service.id}`"
              class="text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              Edit
            </router-link>
            <button @click="confirmDelete(service.id)" class="text-sm font-medium text-red-600 hover:text-red-500">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete cloud service</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this cloud service? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="deleteService"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Yes, delete
            </button>
            <button
              type="button"
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useServicesStore } from '../store/services';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import CloudIcon from '../assets/icons/cloud.svg?component';

const servicesStore = useServicesStore();
const router = useRouter();

const { services, isLoading } = storeToRefs(servicesStore);
const showDeleteModal = ref(false);
const serviceToDelete = ref('');

onMounted(async () => {
  await servicesStore.loadServices();
});

const confirmDelete = (id: string) => {
  serviceToDelete.value = id;
  showDeleteModal.value = true;
};

const deleteService = async () => {
  await servicesStore.deleteService(serviceToDelete.value);
  showDeleteModal.value = false;
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
