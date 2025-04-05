import type { CloudService } from '../types/cloud-service';

const STORAGE_KEY = 'cloud-services';

export const StorageService = {
    getServices(): CloudService[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveServices(services: CloudService[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    },

    getService(id: string): CloudService | undefined {
        const services = this.getServices();
        return services.find(service => service.id === id);
    },

    createService(service: Omit<CloudService, 'id'>): CloudService {
        const services = this.getServices();
        const newService = {
            ...service,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'Running'
        };
        services.push(newService);
        this.saveServices(services);
        return newService;
    },

    updateService(id: string, updates: Partial<CloudService>): CloudService | undefined {
        const services = this.getServices();
        const index = services.findIndex(service => service.id === id);

        if (index !== -1) {
            const updatedService = {
                ...services[index],
                ...updates,
                updatedAt: new Date()
            };
            services[index] = updatedService;
            this.saveServices(services);
            return updatedService;
        }
        return undefined;
    },

    deleteService(id: string): boolean {
        const services = this.getServices();
        const filtered = services.filter(service => service.id !== id);
        this.saveServices(filtered);
        return filtered.length !== services.length;
    }
};