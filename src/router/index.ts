import { createRouter, createWebHistory } from 'vue-router';
import ServicesList from '../views/ServicesList.vue';
import CreateService from '../views/CreateService.vue';
import ServiceDetails from '../views/ServiceDetails.vue';
import DeploymentSuccess from '../views/DeploymentSuccess.vue';
import EditService from '../views/EditService.vue';

const routes = [
    {
        path: '/',
        redirect: '/services/create',
    },
    {
        path: '/services/create',
        name: 'create-service',
        meta: { title: 'Create Cloud Service' },
        component: CreateService,
    },
    {
        path: '/services/edit/:id',
        name: 'edit-service',
        component: EditService,
        props: true,
        meta: { title: 'Edit Cloud Service' }
    },
    {
        path: '/services-list',
        name: 'services-list',
        component: ServicesList,
        meta: { title: 'Cloud Services' }
    },
    {
        path: '/services/:id',
        name: 'service-details',
        component: ServiceDetails,
        props: true,
        meta: { title: 'Service Details' }
    },
    {
        path: '/success',
        name: 'deployment-success',
        component: DeploymentSuccess,
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/services'
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Update document title based on route meta
router.afterEach((to) => {
    const title = to.meta.title as string || 'Cloud Service Deployment';
    document.title = title;
});

export default router;