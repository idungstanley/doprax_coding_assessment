<template>
  <div class="p-6 shadow rounded-md text-left overflow-y-auto h-full w-full">
    <h1 class="text-[17px] font-medium text-left">
      {{ isEditMode ? 'Edit Cloud Service' : 'Configure New Cloud Service' }}
    </h1>
    <Form @submit="validateForm(onSubmit)" class="bg-white">
      <WizardProgress :current-step="currentStep" />
      <KeepAlive>
        <component
          :is="steps[currentStep].component"
          @next="nextStep"
          @back="prevStep"
          :values="values"
          :errors="errors"
        />
      </KeepAlive>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { SubmissionHandler } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { useServicesStore } from '../store/services';
import { Form, useForm } from 'vee-validate';
import WizardProgress from '../components/CloudServiceWizard/WizardProgress.vue';
import StepServiceBasics from '../components/CloudServiceWizard/StepServiceBasics.vue';
import StepResources from '../components/CloudServiceWizard/StepResources.vue';
import StepNetwork from '../components/CloudServiceWizard/StepNetwork.vue';
import StepReview from '../components/CloudServiceWizard/StepReview.vue';
import { cloudServiceSchema } from '../schemas/cloud-service.schema';
import type { CloudServiceForm } from '../types/cloud-service';
import { toTypedSchema } from '@vee-validate/zod';

const route = useRoute();
const router = useRouter();
const servicesStore = useServicesStore();

// Form setup
const {
  handleSubmit: validateForm,
  values,
  errors,
  setValues
} = useForm<CloudServiceForm>({
  validationSchema: toTypedSchema(cloudServiceSchema),
  initialValues: {
    serviceName: '',
    description: '',
    region: 'US West (N. California)',
    instanceType: 'Standard',
    vCPU: 2,
    memory: 4,
    storage: 100,
    vpc: 'Development VPC',
    subnet: 'Development Subnet (AZ-b)',
    assignPublicIP: true,
    securityGroups: ['Web Traffic (80, 443)']
  }
});

const currentStep = ref(0);
const isEditMode = computed(() => !!route.params.id);

const steps = [
  { title: 'Service Basics', component: StepServiceBasics },
  { title: 'Resources', component: StepResources },
  { title: 'Network', component: StepNetwork },
  { title: 'Review', component: StepReview }
];

// Load service data if in edit mode
onMounted(async () => {
  if (isEditMode.value) {
    await servicesStore.loadServices();
    const service = servicesStore.getServiceById(route.params.id as string);
    if (service) {
      const { id, createdAt, updatedAt, status, ...formData } = service;
      setValues(formData); // Fixed: Using setValues to update form values
    }
  }
});

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// Update your onSubmit to explicitly use the SubmissionHandler type
const onSubmit: SubmissionHandler<CloudServiceForm> = async (values, { setErrors }) => {
  try {
    if (isEditMode.value) {
      await servicesStore.updateService({
        id: route.params.id as string,
        updates: values
      });
    } else {
      await servicesStore.createService(values);
    }
    router.push({ name: 'services-list' });
  } catch (error) {
    console.error('Failed to save service:', error);
    // Handle error (show toast/notification)
    // You can use setErrors here if your API returns field-specific errors
    // setErrors({ fieldName: 'Error message' });
  }
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
