<template>
  <div class="text-xs">
    <h3 class="text-lg font-medium text-gray-900 mb-2">Network Settings</h3>
    <p class="text-[#6B7280] mb-6">Configure the network settings for your cloud service.</p>

    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-center w-full gap-3">
        <div class="w-full">
          <label for="vpc" class="block text-sm font-medium text-gray-700">Virtual Private Cloud (VPC) <span class="text-red-400 ml-2">*</span></label>
          <Field
            id="vpc"
            name="vpc"
            as="select"
            :value="props.values.vpc"
            @change="handleChange('vpc', $event)"
            class="mt-1 block w-full border-b pr-10 py-2 text-base border-gray-300 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="development-vpc">Development VPC</option>
            <option value="production-vpc">Production VPC</option>
          </Field>
          <ErrorMessage name="vpc" class="mt-1 text-sm text-red-600" />
        </div>

        <div class="w-full">
          <label for="subnet" class="block text-sm font-medium text-gray-700">Subnet <span class="text-red-400 ml-2">*</span></label>
          <Field
            id="subnet"
            name="subnet"
            as="select"
            :value="props.values.subnet"
            @change="handleChange('subnet', $event)"
            class="mt-1 block border-b w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="default-subnet-(Az-a)">Default Subnet (AZ-a)</option>
            <option value="default-subnet-(Az-b)">Default Subnet (AZ-b)</option>
          </Field>
          <ErrorMessage name="subnet" class="mt-1 text-sm text-red-600" />
        </div>
      </div>

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

const props = defineProps<{
  values: CloudServiceForm;
  errors: Record<string, string>;
}>();

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

const handleChange = (field: keyof CloudServiceForm, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  let value: string | boolean;

  if (field === 'assignPublicIP') {
    value = (target as HTMLInputElement).checked;
  } else {
    value = target.value;
  }

  emit('update:field', field, value);
};

const handleSecurityGroupChange = (groupValue: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;
  const currentGroups = [...props.values.securityGroups];

  if (isChecked) {
    if (!currentGroups.includes(groupValue)) {
      emit('update:field', 'securityGroups', [...currentGroups, groupValue]);
    }
  } else {
    emit('update:field', 'securityGroups', currentGroups.filter((group) => group !== groupValue));
  }
};
</script>

<style scoped>
select option {
  color: black !important;
}
</style>