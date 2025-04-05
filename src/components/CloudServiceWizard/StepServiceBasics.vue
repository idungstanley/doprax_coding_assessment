<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">Service Basics</h3>
    <p class="text-gray-600 mb-6">Provide basic information about your cloud service.</p>

    <div class="space-y-6">
      <!-- Cover Image Upload -->
      <div class="flex items-center space-x-4">
        <div class="flex justify-center items-center rounded-lg w-[100px] h-[100px] text-[#6B7280] bg-[#F3F4F6]">
          <div class="space-y-1 text-center">
            <!-- Show the selected image if available, otherwise show the placeholder -->
            <div v-if="imageUrl" class="w-full h-full">
              <img :src="imageUrl" alt="Selected Cover Image" class="w-full h-full object-cover rounded-lg" />
            </div>
            <div v-else class="space-y-1 text-center">
              <div class="flex text-sm text-nowrap flex-col">
                <img src="@/assets/icons/image-outline.svg" alt="image Icon" class="mx-auto text-gray-400" />
                <label class="relative cursor-pointer rounded-md font-medium">
                  <span>Cover image</span>
                  <Field name="coverImage" type="file" class="sr-only" @change="handleFileUpload" as="input" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <label
          class="flex justify-center items-center rounded-lg w-[40px] h-[40px] border border-[#F3F4F6] cursor-pointer relative"
        >
          <Field name="coverImage" type="file" class="sr-only" @change="handleFileUpload" as="input" />
          <img src="@/assets/icons/upload.svg" alt="image Icon" class="text-gray-400" />
        </label>
        <div
          class="flex justify-center items-center rounded-lg w-[40px] h-[40px] border border-[#F3F4F6]"
          @click="removeImage"
        >
          <img src="@/assets/icons/delete.svg" alt="image Icon" class="mx-auto text-gray-400" />
        </div>
      </div>

      <!-- Service Name -->
      <div>
        <label for="serviceName" class="block text-sm font-medium text-gray-700">Service Name <span class="text-red-400 ml-2">*</span></label>
        <Field
          id="serviceName"
          name="serviceName"
          type="text"
          :value="props.values.serviceName"
          @input="handleChange('serviceName', $event)"
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
          :value="props.values.description"
          @input="handleChange('description', $event)"
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <ErrorMessage name="description" class="mt-1 text-sm text-red-600" />
      </div>

      <!-- Region -->
      <div>
        <label for="region" class="block text-sm font-medium text-gray-700">Region <span class="text-red-400 ml-2">*</span></label>
        <Field
          id="region"
          name="region"
          as="select"
          :value="props.values.region"
          @change="handleChange('region', $event)"
          class="mt-1 block w-full shadow pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select a region</option>
          <option value="US West (N. California)">US West (N. California)</option>
          <option value="US East (N. Virginia)">US East (N. Virginia)</option>
          <option value="Europe (Ireland)">Europe (Ireland)</option>
          <option value="Asia Pacific (Tokyo)">Asia Pacific (Tokyo)</option>
        </Field>
        <ErrorMessage name="region" class="mt-1 text-sm text-red-600" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';
import type { CloudServiceForm } from '../../types/cloud-service';

// Define props for values and errors
const props = defineProps<{
  values: CloudServiceForm;
  errors: Record<string, string>;
}>();

// Define emits for field updates and file upload
const emit = defineEmits<{
  (e: 'update:field', field: keyof CloudServiceForm, value: any): void;
  (e: 'update:coverImage', file: File | null): void;
}>();

// Reactive variable to store the image URL for display
const imageUrl = ref<string | null>(null);

// Function to handle changes to form fields
const handleChange = (field: keyof CloudServiceForm, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const value = target.value;
  emit('update:field', field, value);
};

// Function to handle file upload and emit the file to the parent
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    emit('update:coverImage', file); // Emit the selected file to the parent

    // Convert the file to a URL for display
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    emit('update:coverImage', null); // Emit null if no file is selected
    imageUrl.value = null;
  }
};

// Function to remove the selected image
const removeImage = () => {
  emit('update:coverImage', null); // Emit null to clear the file in the parent
  imageUrl.value = null; // Clear the displayed image
};

// Watch for changes in values.coverImage (e.g., when editing an existing service)
watch(
  () => props.values.coverImage,
  (newFile) => {
    if (newFile instanceof File) {
      // If a file is already present (e.g., in edit mode), convert it to a URL for display
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