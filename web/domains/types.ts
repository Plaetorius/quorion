import type { z } from "zod"
import type {
  formFieldSchema,
  formCreateSchema,
  formUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  fieldResponseSchema,
  formSubmissionSchema,
  validationNoteSchema,
} from "./schema"

// Inferred types from schemas
export type FormField = z.infer<typeof formFieldSchema>
export type FormCreate = z.infer<typeof formCreateSchema>
export type FormUpdate = z.infer<typeof formUpdateSchema>
export type ProjectCreate = z.infer<typeof projectCreateSchema>
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>
export type FieldResponse = z.infer<typeof fieldResponseSchema>
export type FormSubmission = z.infer<typeof formSubmissionSchema>
export type ValidationNote = z.infer<typeof validationNoteSchema>

// Additional types for the application
export type SubmissionStatus = "pending" | "approved" | "rejected"

export interface Project {
  id: string
  name: string
  organizationName: string
  imageUrl: string
  adminAddresses: string[]
  validatorAddresses: string[]
  dataTypes: string[]
  requiredElements: number
  collectedElements: number
  totalPrizePool: number
  distributedPrizePool: number
  contactEmail: string
  description?: string
  createdAt: Date
  updatedAt: Date
  forms?: Form[]
}

export interface Form {
  id: string
  name: string
  description?: string
  projectId: string
  requiredElements?: number
  prizePool?: number
  fields: FormField[]
  createdAt: Date
  updatedAt: Date
}

export interface Submission {
  id: string
  formId: string
  projectId: string
  submitterId: string
  submitterName?: string
  submissionDate: Date
  status: SubmissionStatus
  responses: FieldResponse[]
  notes?: string
}

export interface FormData {
  name: string
  description?: string
  requiredElements?: number
  prizePool?: number
  fields: FormField[]
}

