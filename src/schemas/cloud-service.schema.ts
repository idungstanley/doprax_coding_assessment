// src/schemas/cloud-service.schema.ts
import { z } from 'zod';

// Define reusable schemas
const instanceTypeSchema = z.enum([
    'Standard',
    'Compute Optimized',
    'Memory Optimized',
    'Storage Optimized'
]);

const securityGroupSchema = z.enum([
    'Web Traffic (80, 443)',
    'SSH Access (22)',
    'Database (3306, 5432)',
    'Internal Only'
]);

const regionSchema = z.enum([
    'US West (N. California)',
    'US East (N. Virginia)',
    'Europe (Ireland)',
    'Asia Pacific (Tokyo)',
], {
    required_error: 'Region is required',
});

export const cloudServiceSchema = z.object({
    serviceName: z
        .string()
        .min(3, 'Service name must be at least 3 characters')
        .max(50, 'Service name cannot exceed 50 characters')
        .nonempty('Service name is required'),
    region: regionSchema, // z.enum([...], { required_error: 'Region is required' })

    description: z.string()
        .max(200, 'Description cannot exceed 200 characters')
        .optional(),

    instanceType: instanceTypeSchema,

    vCPU: z.number()
        .min(1, 'Minimum 1 vCPU')
        .max(32, 'Maximum 32 vCPUs'),

    memory: z.number()
        .min(1, 'Minimum 1GB memory')
        .max(256, 'Maximum 256GB memory'),

    storage: z.number()
        .min(10, 'Minimum 10GB storage')
        .max(2000, 'Maximum 2TB storage'),

    vpc: z.string().nonempty('VPC is required'),
    subnet: z.string().nonempty('Subnet is required'),

    assignPublicIP: z.boolean(),

    securityGroups: z.array(securityGroupSchema)
        .min(1, 'Select at least one security group'),
    coverImage: z.instanceof(File).optional().nullable(),
});