<template>
  <div class="p-6 shadow rounded-md text-left overflow-y-auto h-full w-full">
    <h1 class="text-[17px] font-medium text-left">Configure New Cloud Service</h1>
    <Form @submit="validateForm(onSubmit)" class="bg-white">
      <WizardProgress
        :current-step="currentStep"
        :steps="steps"
        @next="nextStep"
        @back="prevStep"
        :on-submit="validateForm(onSubmit)"
      >
        <template #content>
          <KeepAlive>
            <component
              :is="steps[currentStep].component"
              @update:coverImage="updateCoverImage"
              @update:field="updateField"
              :values="values"
              :errors="errors"
            />
          </KeepAlive>
        </template>
      </WizardProgress>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { SubmissionHandler } from 'vee-validate';
import { useRouter } from 'vue-router';
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

const router = useRouter();
const servicesStore = useServicesStore();

const {
  handleSubmit: validateForm,
  values,
  errors,
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

const currentStep = ref(0);

type CloudServiceFormKeys = keyof CloudServiceForm;

const requiredFieldsPerStep: CloudServiceFormKeys[][] = [
  ['serviceName', 'region'],
  ['instanceType', 'vCPU', 'memory', 'storage'],
  ['vpc', 'subnet', 'securityGroups'],
  Object.keys(cloudServiceSchema.shape) as CloudServiceFormKeys[]
];

const steps = [
  { title: 'Service Basics', subtitle: 'Define your service details', component: StepServiceBasics },
  { title: 'Resources', subtitle: 'Configure compute resources', component: StepResources },
  { title: 'Network', subtitle: 'Set up network configuration', component: StepNetwork },
  { title: 'Review', subtitle: 'Review and deploy', component: StepReview }
];

watch(
  () => values,
  (newValues) => {
    console.log('Parent form values updated:', newValues);
  },
  { deep: true }
);

const nextStep = async () => {
  const result = await validate();
  console.log('Validation Result for Step', currentStep.value + 1, ':', result);
  console.log('Form Errors:', errors.value);
  console.log('Form Values:', values);

  const fieldsToValidate = requiredFieldsPerStep[currentStep.value];

  const hasErrorsInCurrentStep = fieldsToValidate.some(
    (field) => (errors.value as Record<CloudServiceFormKeys, string | undefined>)[field]
  );

  if (!hasErrorsInCurrentStep) {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
    }
  } else {
    console.log('Cannot proceed: Required fields in Step', currentStep.value + 1, 'are invalid');
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const updateField = (field: keyof CloudServiceForm, value: any) => {
  setFieldValue(field, value);
  console.log(`Updated ${field} to:`, value);
};

const updateCoverImage = (file: File | null) => {
  setFieldValue('coverImage', file);
};

const onSubmit: SubmissionHandler<CloudServiceForm> = async (values) => {
  const result = await validate();
  console.log('Form Values:', values);
  console.log('Form Errors:', errors.value);

  if (!result.valid) {
    console.log('Form submission failed: Entire form is invalid', errors.value);
    return;
  }

  try {
    await servicesStore.createService(values);
    router.push({ name: 'deployment-success' });
  } catch (error) {
    console.error('Failed to save service:', error);
  }
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
