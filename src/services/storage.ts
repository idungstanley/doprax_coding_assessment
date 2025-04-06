import type { CloudService } from '../types/cloud-service';

export const STORAGE_KEY = 'cloud-services';

export const StorageService = {
    async convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    async prepareServiceForStorage(service: CloudService | Omit<CloudService, 'id'>): Promise<CloudService | Omit<CloudService, 'id'>> {
        if (service.coverImage instanceof File) {
            const base64Image = await this.convertFileToBase64(service.coverImage);
            return {
                ...service,
                coverImage: base64Image,
            };
        }
        return service;
    },

    getServices(): CloudService[] {
        const data = localStorage.getItem(STORAGE_KEY);
        const services = data ? JSON.parse(data) : [];
        return services.map((service: CloudService) => ({
            ...service,
            createdAt: service.createdAt ? new Date(service.createdAt) : undefined,
            updatedAt: service.updatedAt ? new Date(service.updatedAt) : undefined,
        }));
    },

    saveServices(services: CloudService[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    },

    getService(id: string): CloudService | undefined {
        const services = this.getServices();
        return services.find(service => service.id === id);
    },

    async createService(service: Omit<CloudService, 'id'>): Promise<CloudService> {
        const services = this.getServices();
        const preparedService = await this.prepareServiceForStorage(service);
        const newService: CloudService = {
            ...preparedService,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'Running',
        } as CloudService;
        services.push(newService);
        this.saveServices(services);
        return newService;
    },

    async updateService(id: string, updates: Partial<CloudService>): Promise<CloudService | undefined> {
        const services = this.getServices();
        const index = services.findIndex(service => service.id === id);

        if (index !== -1) {
            const preparedUpdates = await this.prepareServiceForStorage(updates as CloudService);
            const updatedService: CloudService = {
                ...services[index],
                ...preparedUpdates,
                updatedAt: new Date(),
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
    },
};