<template>
  <div class="text-xs">
    <h3 class="text-lg font-medium text-gray-900 mb-2">Network Settings</h3>
    <p class="text-[#6B7280] mb-6">Configure the network settings for your cloud service.</p>

    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-center w-full gap-3">
        <!-- VPC -->
        <div class="w-full">
          <label for="vpc" class="block text-sm font-medium text-gray-700">Virtual Private Cloud (VPC) <span class="text-red-400 ml-2">*</span></label>
          <Field
            id="vpc"
            name="vpc"
            as="select"
            :value="props.values.vpc"
            @change="handleChange('vpc', $event)"
            class="mt-1 block w-full shadow pr-10 py-2 text-base border-gray-300 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="development">Development VPC</option>
            <option value="production">Production VPC</option>
            <option value="staging">Staging VPC</option>
          </Field>
          <ErrorMessage name="vpc" class="mt-1 text-sm text-red-600" />
        </div>

        <!-- Subnet -->
        <div class="w-full">
          <label for="subnet" class="block text-sm font-medium text-gray-700">Subnet <span class="text-red-400 ml-2">*</span></label>
          <Field
            id="subnet"
            name="subnet"
            as="select"
            :value="props.values.subnet"
            @change="handleChange('subnet', $event)"
            class="mt-1 block shadow w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="development">Development Subnet (AZ-b)</option>
            <option value="production">Production Subnet (AZ-a)</option>
            <option value="staging">Staging Subnet (AZ-c)</option>
          </Field>
          <ErrorMessage name="subnet" class="mt-1 text-sm text-red-600" />
        </div>
      </div>

      <!-- Public IP -->
      <div class="flex items-start flex-col text-xs">
        <div class="flex items-center h-5 gap-1">
          <Field
            id="assignPublicIP"
            name="assignPublicIP"
            type="checkbox"
            :checked="props.values.assignPublicIP"
            @change="handleChange('assignPublicIP', $event)"
            class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label for="assignPublicIP" class="font-medium text-gray-700">Assign public IP address</label>
        </div>
        <p class="text-gray-500">Enable this to make your service accessible from the Internet</p>
      </div>

      <!-- Security Groups -->
      <div class="flex flex-col text-xs">
        <label class="block font-medium text-gray-700 mb-1">Security Groups <span class="text-red-400 ml-2">*</span></label>
        <p class="text-[#6B7280] mb-2">Select the security groups to apply to your service</p>
        <div class="space-y-2">
          <div v-for="group in securityGroups" :key="group.value" class="flex items-start">
            <div class="flex items-center h-5">
              <Field
                :id="`securityGroup-${group.value}`"
                name="securityGroups"
                :value="group.value"
                type="checkbox"
                :checked="props.values.securityGroups.includes(group.value)"
                @change="handleSecurityGroupChange(group.value, $event)"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <label :for="`securityGroup-${group.value}`" class="font-medium text-[#374151]">{{ group.label }}</label>
            </div>
          </div>
        </div>
        <ErrorMessage name="securityGroups" class="mt-1 text-sm text-red-600" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import type { CloudServiceForm } from '../../types/cloud-service';

// Define props for values and errors
const props = defineProps<{
  values: CloudServiceForm;
  errors: Record<string, string>;
}>();

// Define emits for field updates
const emit = defineEmits<{
  (e: 'update:field', field: keyof CloudServiceForm, value: any): void;
}>();

const securityGroups = [
  {
    value: 'Web Traffic (80, 443)',
    label: 'Web Traffic (80, 443)',
    description: 'Allow HTTP and HTTPS traffic',
  },
  {
    value: 'SSH Access (22)',
    label: 'SSH Access (22)',
    description: 'Allow SSH access',
  },
  {
    value: 'Database (3306, 5432)',
    label: 'Database (3306, 5432)',
    description: 'Allow MySQL and PostgreSQL access',
  },
  {
    value: 'Internal Only',
    label: 'Internal Only',
    description: 'Restrict to internal network only',
  },
] as const;

// Function to handle changes to form fields (vpc, subnet, assignPublicIP)
const handleChange = (field: keyof CloudServiceForm, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  let value: string | boolean;

  if (field === 'assignPublicIP') {
    value = (target as HTMLInputElement).checked; // Use 'checked' for checkbox
  } else {
    value = target.value; // Use 'value' for select elements
  }

  emit('update:field', field, value);
};

// Function to handle changes to securityGroups (array field)
const handleSecurityGroupChange = (groupValue: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;
  const currentGroups = [...props.values.securityGroups];

  if (isChecked) {
    // Add the group if checked and not already in the array
    if (!currentGroups.includes(groupValue)) {
      emit('update:field', 'securityGroups', [...currentGroups, groupValue]);
    }
  } else {
    // Remove the group if unchecked
    emit('update:field', 'securityGroups', currentGroups.filter((group) => group !== groupValue));
  }
};
</script>

<style scoped>
/* Ensure the text in select options is visible */
select option {
  color: black !important;
}
</style>