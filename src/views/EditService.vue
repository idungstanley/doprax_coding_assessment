<template>
  <div class="p-6 shadow rounded-md text-left overflow-y-auto h-full w-full">
    <h1 class="text-[17px] font-medium text-left mb-6">Edit Service Configuration</h1>

    <Form @submit="validateForm(onSubmit)" class="bg-white">
      <!-- Service Basics -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Service Basics</h2>
        <p class="text-sm text-gray-500 mb-4">Provide basic information about your cloud service.</p>

        <!-- Service Name -->
        <div class="mb-4">
          <label for="serviceName" class="block text-sm font-medium text-gray-700">
            Service Name <span class="text-red-500">*</span>
          </label>
          <Field
            name="serviceName"
            id="serviceName"
            v-model="values.serviceName"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="my-cloud-service"
          />
          <ErrorMessage name="serviceName" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700"> Description </label>
          <Field
            name="description"
            v-model="values.description"
            @input="updateField('description', $event)"
            as="textarea"
            class="mt-1 w-full h-fit p-0 border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe your service (optional)"
            
          />
          <ErrorMessage name="description" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Region -->
        <div class="mb-4">
          <label for="region" class="block text-sm font-medium text-gray-700">
            Region <span class="text-red-500">*</span>
          </label>
          <Field
            name="region"
            v-model="values.region"
            as="select"
            class="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @change="updateField('region', $event)"
          >
            <option value="" disabled>Select a region</option>
            <option value="US West (N. California)">US West (N. California)</option>
            <option value="US East (N. Virginia)">US East (N. Virginia)</option>
            <option value="EU (Ireland)">EU (Ireland)</option>
            <option value="Asia Pacific (Tokyo)">Asia Pacific (Tokyo)</option>
          </Field>
          <ErrorMessage name="region" class="text-red-500 text-sm mt-1" />
        </div>
      </div>

      <!-- Resource Configuration -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Resource Configuration</h2>
        <p class="text-sm text-gray-500 mb-4">Configure the compute resources for your service.</p>

        <!-- Instance Type -->
        <div class="mb-4">
          <label for="instanceType" class="block text-sm font-medium text-gray-700"> Instance Type </label>
          <div class="mt-2 space-y-2">
            <div v-for="type in instanceTypes" :key="type.value" class="flex items-center">
              <Field
                name="instanceType"
                v-model="values.instanceType"
                type="radio"
                @click="updateField('instanceType', type.value)"
                :value="type.value"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label :for="type.value" class="ml-3 block text-sm text-gray-700">
                {{ type.label }}
              </label>
            </div>
          </div>
          <ErrorMessage name="instanceType" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- vCPU, Memory, Storage -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label for="vCPU" class="block text-sm font-medium text-gray-700">
              vCPU <span class="text-red-500">*</span>
            </label>
            <Field
              name="vCPU"
              v-model.number="values.vCPU"
              @input="updateField('vCPU', $event)"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <ErrorMessage name="vCPU" class="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <label for="memory" class="block text-sm font-medium text-gray-700">
              Memory (GB) <span class="text-red-500">*</span>
            </label>
            <Field
              name="memory"
              v-model.number="values.memory"
              type="number"
              @input="updateField('memory', $event)"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <ErrorMessage name="memory" class="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <label for="storage" class="block text-sm font-medium text-gray-700">
              Storage (GB) <span class="text-red-500">*</span>
            </label>
            <Field
              name="storage"
              v-model.number="values.storage"
              @input="updateField('storage', $event)"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <ErrorMessage name="storage" class="text-red-500 text-sm mt-1" />
          </div>
        </div>
      </div>

      <!-- Network Settings -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Network Settings</h2>
        <p class="text-sm text-gray-500 mb-4">Configure the network settings for your cloud service.</p>

        <!-- VPC -->
        <div class="mb-4">
          <label for="vpc" class="block text-sm font-medium text-gray-700">
            Virtual Private Cloud (VPC) <span class="text-red-500">*</span>
          </label>
          <Field
            name="vpc"
            v-model="values.vpc"
            as="select"
            @change="updateField('vpc', $event)"
            class="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="" disabled>Select a VPC</option>
            <option value="development-vpc">Development VPC</option>
            <option value="production-vpc">Production VPC</option>
          </Field>
          <ErrorMessage name="vpc" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Subnet -->
        <div class="mb-4">
          <label for="subnet" class="block text-sm font-medium text-gray-700">
            Subnet <span class="text-red-500">*</span>
          </label>
          <Field
            name="subnet"
            v-model="values.subnet"
            as="select"
            @change="updateField('subnet', $event)"
            class="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="" disabled>Select a subnet</option>
            <option value="default-subnet-(Az-a)">Default Subnet (AZ-a)</option>
            <option value="default-subnet-(Az-b)">Default Subnet (AZ-b)</option>
          </Field>
          <ErrorMessage name="subnet" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Assign Public IP -->
        <div class="mb-4">
          <div class="flex items-center">
            <Field
              name="assignPublicIP"
              v-model="values.assignPublicIP"
              type="checkbox"
              @change="updateField('assignPublicIP', $event)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="assignPublicIP" class="ml-2 block text-sm text-gray-700"> Assign public IP address </label>
          </div>
          <p class="mt-1 text-sm text-gray-500">Enable this to make your service accessible from the internet</p>
          <ErrorMessage name="assignPublicIP" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Security Groups -->
        <div class="mb-4">
          <label for="securityGroups" class="block text-sm font-medium text-gray-700"> Security Groups </label>
          <p class="text-sm text-gray-500 mb-2">Select the security groups to apply to your service</p>
          <div class="space-y-2">
            <div v-for="group in securityGroupsOptions" :key="group" class="flex items-center">
              <Field
                name="securityGroups"
                v-model="values.securityGroups"
                type="checkbox"
                :value="group"
                @change="handleSecurityGroupChange(group, $event)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="group" class="ml-2 block text-sm text-gray-700">
                {{ group }}
              </label>
            </div>
          </div>
          <ErrorMessage name="securityGroups" class="text-red-500 text-sm mt-1" />
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import { cloudServiceSchema } from '../schemas/cloud-service.schema';
import type { CloudServiceForm } from '../types/cloud-service';
import { toTypedSchema } from '@vee-validate/zod';
import { useServicesStore } from '../store/services';

const servicesStore = useServicesStore();

// Router setup
const route = useRoute();
const router = useRouter();

// Form setup
const {
  handleSubmit: validateForm,
  values,
  errors,
  setValues,
  validate,
  setFieldValue
} = useForm<CloudServiceForm>({
  validationSchema: toTypedSchema(cloudServiceSchema),
  initialValues: {
    serviceName: '',
    description: '',
    region: '',
    instanceType: 'Standard',
    vCPU: 2,
    memory: 4,
    storage: 100,
    vpc: '',
    subnet: '',
    assignPublicIP: false,
    securityGroups: [],
    coverImage: null
  }
});

// Options for instance types
const instanceTypes = [
  { value: 'Standard', label: 'Standard (General Purpose) - Balanced compute, memory, and networking' },
  { value: 'Compute Optimized', label: 'Compute Optimized - High performance processors' },
  { value: 'Memory Optimized', label: 'Memory Optimized - Fast performance for memory-intensive workloads' },
  { value: 'Storage Optimized', label: 'Storage Optimized - Low latency, high disk throughput' }
];

// Options for security groups
const securityGroupsOptions = ['Web Traffic (80, 443)', 'SSH Access (22)', 'Database (3306, 5432)', 'Internal Only'];

// Watch for changes in values to debug state updates
watch(
  () => values,
  (newValues) => {
    setValues(newValues);
    console.log('Parent form values updated:', newValues);
  },
  { deep: true }
);

// Load service data from localStorage
onMounted(async () => {
  await servicesStore.loadServices();
  const serviceId = route.params.id as string;

  const storedService = servicesStore.getServiceById(serviceId);
  if (storedService) {
    try {
      const formData: CloudServiceForm = {
        ...storedService,
        coverImage: null // Not used in this form
      };
      setValues(formData);
      console.log('Loaded service from setvalues:', values);
    } catch (error) {
      console.error('Failed to parse service data from store:', error);
      router.push({ name: 'services-list' }); // Redirect if data cannot be loaded
    }
  } else {
    console.warn(`No service found in store for ID: ${serviceId}`);
    router.push({ name: 'services-list' });
  }
});

// Handle field updates from the child
const updateField = (field: keyof CloudServiceForm, value: any) => {
  setFieldValue(field, value);
  console.log(`Updated ${field} to:`, value);
};

const handleSecurityGroupChange = (groupValue: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;
  const currentGroups = [...values.securityGroups];

  if (isChecked) {
    // Add the group if checked and not already in the array
    if (!currentGroups.includes(groupValue)) {
      updateField('securityGroups', [...currentGroups, groupValue]);
    }
  } else {
    // Remove the group if unchecked
    updateField(
      'securityGroups',
      currentGroups.filter((group) => group !== groupValue)
    );
  }
};

console.log('Form submission:', values);

// Form submission handler
const onSubmit = async (values: CloudServiceForm) => {
  console.log('Form submission successful:', values);
  const result = await validate();
  if (!result.valid) {
    console.log('Form submission failed: Entire form is invalid', errors.value);
    return;
  }

  try {
    const serviceId = route.params.id as string;
    const dataToSave = {
      ...values,
      coverImage: null // Exclude coverImage since it's not used in this form
    };

    // Update in localStorage
    servicesStore.updateService({ id: serviceId, updates: dataToSave });

    console.log(`Updated service in localStorage with ID: ${serviceId}`);

    // Navigate to the success page
    router.push({ name: 'deployment-success' });
  } catch (error) {
    console.error('Failed to save service:', error);
  }
};

// Cancel button handler
const cancel = () => {
  router.push({ name: 'services-list' });
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
