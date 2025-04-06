<template>
  <div class="min-h-full w-full h-full flex rounded-2xl justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full h-fit md:h-full text-center">
      <!-- Green Checkmark Circle -->
      <div class="flex justify-center mb-4">
        <div class="w-12 h-12 flex items-center justify-center">
          <img src="@/assets/icons/check.svg" alt="check icon" />
        </div>
      </div>

      <!-- Success Message -->
      <h2 class="md:text-lg text-base font-semibold text-gray-900 mb-2">Cloud Service Successfully Deployed</h2>
      <p class="text-gray-600 text-xs mb-6">Click on the button below to view and manage your cloud service</p>

      <!-- View Cloud Service Button -->
      <button
        @click="viewCloudService"
        class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      >
        View cloud service
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// Redirect to the services-list route when the button is clicked
const viewCloudService = () => {
  router.push({ name: 'services-list' });
};
</script>
