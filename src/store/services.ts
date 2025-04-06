import { defineStore } from 'pinia';
import { StorageService } from '../services/storage';
import type { CloudService, CloudServiceForm } from '../types/cloud-service';

export const useServicesStore = defineStore('services', {
    state: () => ({
        services: [] as CloudService[],
        currentService: null as CloudService | null,
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        allServices: (state) => state.services,
        getServiceById: (state) => (id: string) => state.services.find((service) => service.id === id),
        currentServiceDetails: (state) => state.currentService,
    },

    actions: {
        async loadServices() {
            try {
                this.isLoading = true;
                this.error = null;
                this.services = StorageService.getServices();
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to load services';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async createService(serviceData: CloudServiceForm) {
            try {
                this.isLoading = true;
                this.error = null;
                // Await the result of StorageService.createService
                const newService = await StorageService.createService({
                    ...serviceData,
                    status: 'Running',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                this.services.push(newService);
                return newService;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to create service';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateService({ id, updates }: { id: string; updates: Partial<CloudService>; }) {
            try {
                this.isLoading = true;
                this.error = null;
                // Await the result of StorageService.updateService
                const updatedService = await StorageService.updateService(id, {
                    ...updates,
                    updatedAt: new Date(),
                });

                if (updatedService) {
                    const index = this.services.findIndex((s) => s.id === id);
                    if (index !== -1) {
                        this.services.splice(index, 1, updatedService);
                    }
                    if (this.currentService?.id === id) {
                        this.currentService = updatedService;
                    }
                    return updatedService;
                }
                return undefined;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to update service';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteService(id: string) {
            try {
                this.isLoading = true;
                this.error = null;
                const deleted = StorageService.deleteService(id);
                if (deleted) {
                    this.services = this.services.filter((service) => service.id !== id);
                    if (this.currentService?.id === id) {
                        this.currentService = null;
                    }
                }
                return deleted;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to delete service';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        setCurrentService(service: CloudService | null) {
            this.currentService = service;
        },

        setCurrentServiceById(id: string) {
            this.currentService = this.services.find((s) => s.id === id) || null;
        },

        clearCurrentService() {
            this.currentService = null;
        },

        async refreshServices() {
            await this.loadServices();
        },

        async getServiceStatus(id: string) {
            const service = this.services.find((s) => s.id === id);
            return service?.status || null;
        },

        async updateServiceStatus(id: string, status: 'Running' | 'Deploying' | 'Stopped' | 'Error') {
            return this.updateService({
                id,
                updates: { status, updatedAt: new Date() },
            });
        },
    },
});