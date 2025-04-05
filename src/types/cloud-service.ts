// types/cloud-service.ts
export interface CloudService {
    id: string;
    serviceName: string;
    description: string;
    region: string;
    instanceType: 'Standard' | 'Compute Optimized' | 'Memory Optimized' | 'Storage Optimized';
    vCPU: number;
    memory: number;
    storage: number;
    vpc: string;
    subnet: string;
    assignPublicIP: boolean;
    securityGroups: string[];
    createdAt: Date;
    updatedAt: Date;
    status: string
}

export interface CloudServiceForm extends Omit<CloudService, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
    id?: string;
}