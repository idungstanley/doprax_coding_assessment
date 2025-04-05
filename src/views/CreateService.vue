<template>
  <div class="p-6 shadow rounded-md text-left overflow-y-auto h-full w-full">
    <h1 class="text-[17px] font-medium text-left">
      {{ isEditMode ? 'Edit Cloud Service' : 'Configure New Cloud Service' }}
    </h1>
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
import { ref, computed, onMounted, watch } from 'vue';
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

// Router and store setup
const route = useRoute();
const router = useRouter();
const servicesStore = useServicesStore();

// Form setup
const {
  handleSubmit: validateForm,
  values,
  errors,
  setValues,
  validate,
  setFieldValue,
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
    coverImage: null,
  },
});

const currentStep = ref(0);
const isEditMode = computed(() => !!route.params.id);

// Define a type for the keys of CloudServiceForm
type CloudServiceFormKeys = keyof CloudServiceForm;

// Define required fields for each step
const requiredFieldsPerStep: CloudServiceFormKeys[][] = [
  // Step 1: Service Basics
  ['serviceName', 'region'],
  // Step 2: Resources
  ['instanceType', 'vCPU', 'memory', 'storage'],
  // Step 3: Network
  ['vpc', 'subnet', 'securityGroups'],
  // Step 4: Review (validate all fields)
  Object.keys(cloudServiceSchema.shape) as CloudServiceFormKeys[],
];

const steps = [
  { title: 'Service Basics', subtitle: 'Define your service details', component: StepServiceBasics },
  { title: 'Resources', subtitle: 'Configure compute resources', component: StepResources },
  { title: 'Network', subtitle: 'Set up network configuration', component: StepNetwork },
  { title: 'Review', subtitle: 'Review and deploy', component: StepReview },
];

// Load service data from localStorage if in edit mode
onMounted(() => {
  if (isEditMode.value) {
    const serviceId = route.params.id as string;
    const storedService = localStorage.getItem(`cloudService_${serviceId}`);
    
    if (storedService) {
      try {
        const serviceData = JSON.parse(storedService);
        // Since localStorage can't store File objects, coverImage might be a Base64 string or null
        const formData: CloudServiceForm = {
          ...serviceData,
          coverImage: null, // We'll handle coverImage separately if needed
        };
        setValues(formData);
        console.log('Loaded service from localStorage:', formData);
      } catch (error) {
        console.error('Failed to parse service data from localStorage:', error);
        // Optionally, fall back to default values or show an error to the user
      }
    } else {
      console.warn(`No service found in localStorage for ID: ${serviceId}`);
      // Optionally, redirect to a "not found" page or show an error
    }
  }
});

// Watch for changes in values to debug state updates
watch(
  () => values,
  (newValues) => {
    console.log('Parent form values updated:', newValues);
  },
  { deep: true }
);

const nextStep = async () => {
  // Validate the entire form
  const result = await validate();
  console.log('Validation Result for Step', currentStep.value + 1, ':', result);
  console.log('Form Errors:', errors.value);
  console.log('Form Values:', values);

  // Get the fields to validate for the current step
  const fieldsToValidate = requiredFieldsPerStep[currentStep.value];

  // Check if there are any errors for the fields in the current step
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

// Handle field updates from the child
const updateField = (field: keyof CloudServiceForm, value: any) => {
  setFieldValue(field, value);
  console.log(`Updated ${field} to:`, value);
};

// Handle cover image update
const updateCoverImage = (file: File | null) => {
  setFieldValue('coverImage', file);
};

// Form submission handler (validate all fields on submit)
const onSubmit: SubmissionHandler<CloudServiceForm> = async (values) => {
  const result = await validate(); // Validate the entire form on submit
  console.log('Form Values:', values);
  console.log('Form Errors:', errors.value);

  if (!result.valid) {
    console.log('Form submission failed: Entire form is invalid', errors.value);
    return;
  }

  try {
    // Prepare the data to save (excluding coverImage since localStorage can't store File objects)
    const dataToSave = {
      ...values,
      coverImage: null, // Exclude the File object
    };

    if (isEditMode.value) {
      // In edit mode, update the service in localStorage
      const serviceId = route.params.id as string;
      localStorage.setItem(`cloudService_${serviceId}`, JSON.stringify(dataToSave));
      console.log(`Updated service in localStorage with ID: ${serviceId}`);
      
      // Optionally, update in servicesStore if you still want to sync with the store
      await servicesStore.updateService({
        id: serviceId,
        updates: values,
      });
    } else {
      // In create mode, generate a new ID and save to localStorage
      const newId = Date.now().toString(); // Simple ID generation; you might want a more robust method
      localStorage.setItem(`cloudService_${newId}`, JSON.stringify(dataToSave));
      console.log(`Created new service in localStorage with ID: ${newId}`);
      
      // Optionally, save to servicesStore
      await servicesStore.createService(values);
    }
    
    router.push({ name: 'services-list' });
  } catch (error) {
    console.error('Failed to save service:', error);
    // Handle error (e.g., show toast/notification)
  }
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>