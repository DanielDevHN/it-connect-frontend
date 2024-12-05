import { z } from 'zod';
import { userSchema } from './usersschema';
import { categorySchema } from './categoriesschema';

// export const IncidentPriority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']); 

export const RequestStatus = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED']);

export const requestSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: RequestStatus, // Example of possible statuses
  categories: z.array(categorySchema),
  requestor: userSchema,
  assignee: userSchema.optional(), // Assignee is optional
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  updatedAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'updatedAt must be a valid date string',
  }),
  plannedForDate: z
    .preprocess(
      (val) => (val === undefined || val === null ? null : val),
      z.string().refine((val) => val === null || !isNaN(Date.parse(val)), {
        message: 'resolvedAt must be a valid date string',
      })
    ),
  resolvedAt: z
    .preprocess(
      (val) => (val === undefined || val === null ? null : val),
      z.string().refine((val) => val === null || !isNaN(Date.parse(val)), {
        message: 'resolvedAt must be a valid date string',
      })
    )
    .optional(),
  approvers: z.array(userSchema),
  comments: z.array(
    z.object({
      id: z.number().int().positive('Comment ID must be a positive integer'), // The unique ID for the comment
      content: z.string().min(1, 'Content is required'), // The content of the comment
      requestId: z.number().int().positive('Incident ID must be a positive integer'), // The ID of the related incident
      userId: z.number().int().positive('User ID must be a positive integer'), // The ID of the user who made the comment
      createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'createdAt must be a valid date string', // The date the comment was created
      }),
      user: userSchema.omit({ phone: true }),
    })
  ).optional(),
});

export const createRequestSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  requestorId: z.number().int().positive({ message: "Requestor is required." }),
  status: RequestStatus.optional(),
  assigneeId: z.number().int().nullable().optional(),
  categories: z.array(z.number().int()).nonempty('The request should have at least 1 category'),
  plannedForDate: z.date(),
  resolvedAt: z.date().optional(),
});

export type RequestSchema = z.infer<typeof requestSchema>;
export type CreateRequest = z.infer<typeof createRequestSchema>;