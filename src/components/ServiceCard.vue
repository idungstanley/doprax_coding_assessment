<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="p-6 flex flex-col">
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
      <p class="mt-1 text-sm text-gray-500 text-left">{{ service.description || 'No description' }}</p>
    </div>

    <div class="border-gray-200 border-t px-6 py-3 flex justify-between">
      <div class="space-x-4 flex items-center">
        <router-link
          :to="`/services/edit/${service.id}`"
          class="text-sm font-medium text-gray-600 hover:text-gray-500"
        >
          <img src="@/assets/icons/editIcon.svg" alt="edit icon" class="h-5 w-5" />
        </router-link>
        <button
          @click="$emit('delete', service.id)"
          class="text-sm font-medium text-red-600 hover:text-red-500 cursor-pointer"
        >
          <img src="@/assets/icons/deleteIcon.svg" alt="delete icon" class="h-5 w-5" />
        </button>
      </div>
      <button
        @click="$emit('view-details', service)"
        class="text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CloudService } from '../types/cloud-service';

defineProps<{
  service: CloudService;
}>();

defineEmits<{
  (e: 'delete', id: string): void;
  (e: 'view-details', service: CloudService): void;
}>();
</script>