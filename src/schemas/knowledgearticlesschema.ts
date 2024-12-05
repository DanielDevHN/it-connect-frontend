import { z } from 'zod';
import { userSchema } from './usersschema';
import { categorySchema } from './categoriesschema';

const AssetStatus = z.enum(['ACTIVE', 'INACTIVE', 'DECOMMISSIONED']); 
const AssetType = z.enum(['HARDWARE', 'SOFTWARE', 'LICENSE', 'OTHER']); 

const assetSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  owner: userSchema.omit({ phone: true }).optional(), 
  status: AssetStatus,
  type: AssetType,
})

export const knowledgeArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  docUrl: z.string().url(),
  categories: z.array(z.number().int()).nonempty('The knowledgeartarticle should have at least 1 category'), // List of category IDs
  assets: z.array(z.number().int()).nonempty('The knowledgeartarticle should have at least 1 assets'), // List of category IDs
  createdById: z.number().int().optional(),
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  updatedAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'updatedAt must be a valid date string',
  }),
  createdBy: userSchema,
  lastModifiedBy: userSchema.optional(),
  isPublished: z.boolean(),
});

export const createKnowledgeArticleSchema = z.object({
  title: z.string().min(1, 'Title must not be empty'),
  docUrl: z.string().optional(),
  categories: z.array(z.number().int()).nonempty('The knowledgeartarticle should have at least 1 category'),
  assets: z.array(z.number().int()).optional(),
  createdById: z.number().int().positive('Must specify who created the document'), // Usuario que crea el artículo
  lastModifiedById: z.number().int().optional(), // Usuario que crea el artículo
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
});

export const updateKnowledgeArticleSchema = z.object({
  id: z.number(), // El ID es obligatorio para identificar qué artículo se actualiza
  title: z.string(),
  docUrl: z.string().url().optional(),
  categories: z.array(categorySchema).optional(),
  updatedAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'updatedAt must be a valid date string',
  }),
  isPublished: z.boolean().optional(),
  assets: z.array(assetSchema).optional(),
  lastModifiedBy: userSchema.optional(), // Usuario que modifica el artículo
});


export type KnowledgeArticle = z.infer<typeof knowledgeArticleSchema>;
export type CreateKnowledgeArticle = z.infer<typeof createKnowledgeArticleSchema>;
export type UpdateKnowledgeArticle = z.infer<typeof updateKnowledgeArticleSchema>;