import { z } from "zod"

// Base schemas for reuse
export const idSchema = z.string() // .min(1) commented out
export const dateSchema = z.date().or(z.string()) // .datetime() commented out

// Field schemas
export const formFieldSchema = z.object({
  id: idSchema.optional(), // Optional for creation, required for updates
  label: z.string(), // .min(1, "Field label is required") commented out
  type: z.string(), // z.enum(...) commented out for flexibility
  required: z.boolean().default(false),
  order: z.number(), // .int().nonnegative() commented out
  options: z.array(z.string()).optional(),
  fileTypes: z.array(z.string()).optional(),
  maxFiles: z.number().optional(), // .int().positive() commented out
})

// Form schemas
export const formCreateSchema = z.object({
  name: z.string(), // .min(3, "Form name must be at least 3 characters") commented out
  description: z.string().optional(),
  requiredElements: z.number().optional(), // .int().positive() commented out
  prizePool: z.number().optional(), // .nonnegative() commented out
  fields: z.array(formFieldSchema),
  projectId: idSchema,
})

export const formUpdateSchema = formCreateSchema.extend({
  id: idSchema,
})

// Project schemas
export const projectCreateSchema = z.object({
  name: z.string(), // .min(3, "Project name must be at least 3 characters") commented out
  organizationName: z.string(), // .min(2, "Organization name is required") commented out
  imageUrl: z.string(), // .url("Please enter a valid URL") commented out
  description: z.string(), // .min(10, "Description must be at least 10 characters") commented out
  adminAddresses: z.array(z.string()), // .min(1) and .min(1, "At least one admin address is required") commented out
  validatorAddresses: z.array(z.string()), // .min(1) commented out
  dataTypes: z.array(z.string()), // .min(1, "Select at least one data type") commented out
  contactEmail: z.string(), // .email("Please enter a valid email address") commented out
  forms: z.array(formCreateSchema).optional(),
})

export const projectUpdateSchema = projectCreateSchema.extend({
  id: idSchema,
})

// Submission schemas
export const fieldResponseSchema = z.object({
  fieldId: idSchema,
  textValue: z.string().optional(),
  numberValue: z.number().optional(),
  booleanValue: z.boolean().optional(),
  dateValue: dateSchema.optional(),
  fileUrls: z.array(z.string()).optional(),
})

export const formSubmissionSchema = z.object({
  formId: idSchema,
  projectId: idSchema,
  submitterId: z.string(),
  responses: z.array(fieldResponseSchema),
})

// Validation schemas
export const validationNoteSchema = z.object({
  submissionId: idSchema,
  note: z.string().optional(),
  status: z.string(), // z.enum(["approved", "rejected"]) commented out
})

// import { z } from "zod"

// // Base schemas for reuse
// export const idSchema = z.string().min(1)
// export const dateSchema = z.date().or(z.string().datetime())

// // Field schemas
// export const formFieldSchema = z.object({
//   id: idSchema.optional(), // Optional for creation, required for updates
//   label: z.string().min(1, "Field label is required"),
//   type: z.enum(["text", "number", "email", "date", "select", "checkbox", "radio", "file", "textarea"]),
//   required: z.boolean().default(false),
//   order: z.number().int().nonnegative(),
//   options: z.array(z.string()).optional(),
//   fileTypes: z.array(z.string()).optional(),
//   maxFiles: z.number().int().positive().optional(),
// })

// // Form schemas
// export const formCreateSchema = z.object({
//   name: z.string().min(3, "Form name must be at least 3 characters"),
//   description: z.string().optional(),
//   requiredElements: z.number().int().positive().optional(),
//   prizePool: z.number().nonnegative().optional(),
//   fields: z.array(formFieldSchema),
//   projectId: idSchema,
// })

// export const formUpdateSchema = formCreateSchema.extend({
//   id: idSchema,
// })

// // Project schemas
// export const projectCreateSchema = z.object({
//   name: z.string().min(3, "Project name must be at least 3 characters"),
//   organizationName: z.string().min(2, "Organization name is required"),
//   imageUrl: z.string().url("Please enter a valid URL"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   adminAddresses: z.array(z.string().min(1)).min(1, "At least one admin address is required"),
//   validatorAddresses: z.array(z.string().min(1)),
//   dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
//   contactEmail: z.string().email("Please enter a valid email address"),
//   forms: z.array(formCreateSchema).optional(),
// })

// export const projectUpdateSchema = projectCreateSchema.extend({
//   id: idSchema,
// })

// // Submission schemas
// export const fieldResponseSchema = z.object({
//   fieldId: idSchema,
//   textValue: z.string().optional(),
//   numberValue: z.number().optional(),
//   booleanValue: z.boolean().optional(),
//   dateValue: dateSchema.optional(),
//   fileUrls: z.array(z.string()).optional(),
// })

// export const formSubmissionSchema = z.object({
//   formId: idSchema,
//   projectId: idSchema,
//   submitterId: z.string(),
//   responses: z.array(fieldResponseSchema),
// })

// // Validation schemas
// export const validationNoteSchema = z.object({
//   submissionId: idSchema,
//   note: z.string().optional(),
//   status: z.enum(["approved", "rejected"]),
// })

