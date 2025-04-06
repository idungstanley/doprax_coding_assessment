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
      <ServiceCard
        v-for="service in services"
        :key="service.id"
        :service="service"
        @delete="confirmDelete"
        @view-details="openDetailsModal"
      />
    </div>

    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full justify-center items-center"
        >
          <div class="flex flex-col items-center justify-center h-[280px]">
            <div class="flex flex-col justify-center items-center grow w-full h-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center">
                <div class="flex flex-col items-center justify-center gap-4">
                  <img src="../assets/icons/deleteIcon.svg" alt="delete icon" class="h-6 w-6 text-red-600" />
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Delete this cloud service</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">Are you sure you want to delete this cloud service?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 sm:px-6 gap-4 flex items-center justify-center">
                <button
                  type="button"
                  @click="showDeleteModal = false"
                  class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2 px-2 h-[38px] text-nowrap bg-white text-base font-medium text-gray-700 hover:bg-gray-50 w-fit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  No, Cancel
                </button>
                <button
                  type="button"
                  @click="deleteService"
                  class="w-full inline-flex justify-center h-[38px] items-center rounded-md border border-transparent px-2 shadow-sm py-3 bg-[#EF4444] text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-20 overflow-y-auto w-screen h-screen"
      @click.self="showDetailsModal = false"
    >
      <div
        class="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div
        :class="[
          'fixed bg-white shadow-xl transform transition-all duration-300',
          'sm:w-full',
          'md:h-full md:w-[40%]',
          'w-full right-0 bottom-0 h-[90vh]',
          showDetailsModal
            ? 'md:translate-x-0 translate-y-0'
            : 'md:translate-x-full translate-y-full'
        ]"
      >
        <div class="flex flex-col h-full">
          <div class="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Cloud service details</h2>
            <div class="flex space-x-2">
              <router-link
                :to="`/services/edit/${selectedService?.id}`"
                class="text-gray-600 hover:text-gray-500"
              >
                <img src="@/assets/icons/editIcon.svg" alt="edit icon" class="h-5 w-5" />
              </router-link>
              <button
                @click="confirmDelete(selectedService?.id as string)"
                class="text-red-600 hover:text-red-500"
              >
                <img src="@/assets/icons/deleteIcon.svg" alt="delete icon" class="h-5 w-5" />
              </button>
              <button @click="showDetailsModal = false" class="text-gray-600 hover:text-gray-500">
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto bg-gray-100 m-4 text-left rounded-md">
            <div class="mb-4 border-b border-gray-200 p-4 ">
              <h3 class="text-sm font-medium text-gray-500 uppercase">Cover Image</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">No cover image</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="border-b border-gray-200 p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase">Name</h3>
                <p class="mt-1 text-gray-900">{{ selectedService?.serviceName || 'N/A' }}</p>
              </div>
              <div class="border-b border-gray-200 p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase">Description</h3>
                <p class="mt-1 text-gray-900">{{ selectedService?.description || 'N/A' }}</p>
              </div>
              <div class="border-b border-gray-200 p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase">Region</h3>
                <p class="mt-1 text-gray-900">{{ selectedService?.region || 'N/A' }}</p>
              </div>
              <div class="border-b border-gray-200 p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase">Instance Type</h3>
                <p class="mt-1 text-gray-900">{{ selectedService?.instanceType || 'N/A' }}</p>
              </div>
              <div class="border-b border-gray-200 p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase">Resources</h3>
                <p class="mt-1 text-gray-900">
                  {{ selectedService?.vCPU || 'N/A' }} vCPU, {{ selectedService?.memory || 'N/A' }} GB Memory,
                  {{ selectedService?.storage || 'N/A' }} GB Storage
                </p>
              </div>
              <div class="p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase">Network</h3>
                <p class="mt-1 text-gray-900">
                  VPC: {{ selectedService?.vpc || 'N/A' }}<br />
                  Subnet: {{ selectedService?.subnet || 'N/A' }}<br />
                  Public IP: {{ selectedService?.assignPublicIP ? 'Yes' : 'No' }}<br />
                  Security Groups: {{ selectedService?.securityGroups?.join(', ') || 'N/A' }}
                </p>
              </div>
            </div>
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
import ServiceCard from '../components/ServiceCard.vue';
import type { CloudService } from '../types/cloud-service';

const servicesStore = useServicesStore();

const { services, isLoading } = storeToRefs(servicesStore);
const showDeleteModal = ref(false);
const serviceToDelete = ref('');
const showDetailsModal = ref(false);
const selectedService = ref<CloudService | null>(null);

onMounted(async () => {
  await servicesStore.loadServices();
});

const confirmDelete = (id: string) => {
  serviceToDelete.value = id;
  showDeleteModal.value = true;
};

const deleteService = async () => {
  servicesStore.deleteService(serviceToDelete.value);
  services.value = services.value.filter((service) => service.id !== serviceToDelete.value);
  showDeleteModal.value = false;
  showDetailsModal.value = false;
};

const openDetailsModal = (service: CloudService) => {
  selectedService.value = service;
  showDetailsModal.value = true;
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>