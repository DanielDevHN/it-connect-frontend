import { z } from 'zod';
import { userSchema } from './usersschema';
import { AssetStatus, AssetType } from './assetsschema';

export const IncidentPriority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']); 

export const IncidentStatus = z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ON_HOLD']);

const assetSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  owner: userSchema.omit({ phone: true }).optional(), 
  status: AssetStatus,
  type: AssetType,
})

export const commentSchema = z.object({
  id: z.number().int().positive('Comment ID must be a positive integer'), // The unique ID for the comment
  content: z.string().min(1, 'Content is required'), // The content of the comment
  incidentId: z.number().int().positive('Incident ID must be a positive integer'), // The ID of the related incident
  userId: z.number().int().positive('User ID must be a positive integer'), // The ID of the user who made the comment
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string', // The date the comment was created
  }),
  user: userSchema.omit({ phone: true }),
});

export const incidentSchema = z.object({
  id: z.number().int().positive('Incident ID must be a positive integer'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: IncidentStatus,
  priority: IncidentPriority,
  categories: z.array(z.number().int()).optional(),
  reporter: userSchema.omit({ phone: true }),
  assignee: userSchema.omit({ phone: true }).optional(),
  asset: assetSchema.optional(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'updatedAt must be a valid date string',
  }),
  resolvedAt: z
    .preprocess(
      (val) => (val === undefined || val === null ? null : val),
      z.string().refine((val) => val === null || !isNaN(Date.parse(val)), {
        message: 'resolvedAt must be a valid date string',
      })
    )
    .optional(),
  comments: z.array(commentSchema).optional(),
});

export const createIncidentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: IncidentStatus.optional(),
  priority: IncidentPriority,
  categories: z.array(z.number().int()).nonempty('The incident should have at least 1 category'), // List of category IDs
  reporterId: z.number().int().positive('Please select a reporter'),
  assetId: z.number().int().optional(),
  assigneeId: z.number().int().optional(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  resolvedAt: z.date().optional(),
}).refine(
  (data) => {
    // If status is RESOLVED, resolvedAt must be defined
    if (data.status === IncidentStatus.enum.RESOLVED) {
      return data.resolvedAt !== undefined;
    }
    return true;
  },
  {
    message: 'resolvedAt is required when status is RESOLVED',
    path: ['resolvedAt'],
  }
);

export const updateIncidentSchema = z.object({
  title: z.string().min(1, 'Title must not be empty').optional(),
  description: z.string().min(1, 'Description must not be empty').optional(),
  categories: z.array(z.number().int()).nonempty('Categories must not be empty').optional(),
  assetId: z.number().int().positive('Asset ID must be a positive integer').optional(),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'updatedAt must be a valid date string',
  }),
});

export type Incident = z.infer<typeof incidentSchema>;
export type CreateIncident = z.infer<typeof createIncidentSchema>;
export type UpdateIncident = z.infer<typeof updateIncidentSchema>;