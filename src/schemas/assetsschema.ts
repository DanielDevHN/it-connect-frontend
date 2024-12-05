import { z } from 'zod';
import { userSchema } from './usersschema';
import { knowledgeArticleSchema } from './knowledgearticlesschema';
import { categorySchema } from './categoriesschema';

export const AssetStatus = z.enum(['ACTIVE', 'INACTIVE', 'DECOMMISSIONED']); 
export const AssetType = z.enum(['HARDWARE', 'SOFTWARE', 'LICENSE', 'OTHER']); 

const incidentSchema = z.object({
  id: z.number().int().positive('Incident ID must be a positive integer'),
  title: z.string().min(1, 'Title is required'),
});

export const assetSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  owner: userSchema.omit({ phone: true }).optional(), 
  status: AssetStatus,
  type: AssetType,
  categories: z.array(categorySchema),
  description: z.string().min(1, 'Description is required'),
  purchasedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'purchasedAt must be a valid date string',
  }),
  warrantyExpiresAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'warrantyExpiresAt must be a valid date string',
  }).optional(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'updatedAt must be a valid date string',
  }),
  incidents: z.array(incidentSchema).optional(),
  articles: z.array(knowledgeArticleSchema).optional(),
});

export const createAssetSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: AssetStatus,
  type: AssetType,
  categories: z.array(z.number()).min(1, { message: "Categories should not be empty" }),
  ownerId: z.number().int().optional(),
  purchasedAt: z.date(),
  warrantyExpiresAt: z.date().optional(),
  createdAt: z.string().refine(value => !isNaN(Date.parse(value)), { message: "Invalid date string" }),
});

// TypeScript Types
export type Asset = z.infer<typeof assetSchema>;
export type CreateAsset = z.infer<typeof createAssetSchema>;