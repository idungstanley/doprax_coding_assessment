import { createRouter, createWebHistory } from 'vue-router';
import ServicesList from '../views/ServicesList.vue';
import CreateService from '../views/CreateService.vue';
import ServiceDetails from '../views/ServiceDetails.vue';

const routes = [
    {
        path: '/',
        redirect: '/services'
    },
    {
        path: '/services',
        name: 'services-list',
        component: ServicesList,
        meta: { title: 'Cloud Services' }
    },
    {
        path: '/services/create',
        name: 'create-service',
        component: CreateService,
        meta: { title: 'Create Cloud Service' }
    },
    {
        path: '/services/edit/:id',
        name: 'edit-service',
        component: CreateService,
        props: true,
        meta: { title: 'Edit Cloud Service' }
    },
    {
        path: '/services/:id',
        name: 'service-details',
        component: ServiceDetails,
        props: true,
        meta: { title: 'Service Details' }
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