/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockForms } from "./mock-forms"

export interface FormSubmission {
  id: string
  formId: string
  projectId: string
  submitterId: string
  submitterName: string
  submissionDate: string
  status: "pending" | "approved" | "rejected"
  responses: {
    fieldId: string
    value: string | string[] | number | boolean | null
    fileUrls?: string[]
  }[]
  notes?: string
}

// Helper function to get a random form field value based on field type
const getRandomValue = (fieldType: string, options?: string[]) => {
  switch (fieldType) {
    case "text":
      return `Sample text response ${Math.floor(Math.random() * 1000)}`
    case "number":
      return Math.floor(Math.random() * 200)
    case "email":
      return `user${Math.floor(Math.random() * 100)}@example.com`
    case "date":
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      return date.toISOString().split("T")[0]
    case "select":
    case "radio":
      if (options && options.length > 0) {
        return options[Math.floor(Math.random() * options.length)]
      }
      return "Option 1"
    case "checkbox":
      if (options && options.length > 0) {
        const numSelected = Math.floor(Math.random() * options.length) + 1
        const shuffled = [...options].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, numSelected)
      }
      return ["Option 1"]
    case "file":
      return null // File values will be handled separately
    default:
      return "Sample response"
  }
}

// Generate mock submissions based on our mock forms
export const generateMockSubmissions = (count = 10): FormSubmission[] => {
  const submissions: FormSubmission[] = []

  for (let i = 0; i < count; i++) {
    // Pick a random form
    const randomForm = mockForms[Math.floor(Math.random() * mockForms.length)]

    // Generate responses for each field in the form
    const responses = randomForm.fields.map((field) => {
      const response: any = {
        fieldId: field.id,
        value: getRandomValue(field.type, field.options),
      }

      // Add file URLs for file fields
      if (field.type === "file") {
        const fileCount = field.maxFiles ? Math.min(Math.floor(Math.random() * 3) + 1, field.maxFiles) : 1
        const fileTypes = field.fileTypes || ["image/*"]

        const fileUrls = Array(fileCount)
          .fill(0)
          .map((_, index) => {
            if (fileTypes.includes("image/*")) {
              return `/placeholder.svg?height=400&width=600&text=Image+${index + 1}`
            } else if (fileTypes.includes("video/*")) {
              return `/placeholder.svg?height=400&width=600&text=Video+${index + 1}`
            } else if (fileTypes.includes("audio/*")) {
              return `/placeholder.svg?height=400&width=600&text=Audio+${index + 1}`
            } else {
              return `/placeholder.svg?height=400&width=600&text=File+${index + 1}`
            }
          })

        response.fileUrls = fileUrls
      }

      return response
    })

    // Generate a random date within the last 7 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 7))

    submissions.push({
      id: `submission-${Date.now()}-${i}`,
      formId: randomForm.id,
      projectId: randomForm.projectId,
      submitterId: `0x${Math.random().toString(16).substring(2, 14)}`,
      submitterName: `Contributor ${i + 1}`,
      submissionDate: date.toISOString(),
      status: "pending",
      responses,
    })
  }

  return submissions
}

// Generate 15 mock submissions
export const mockSubmissions: FormSubmission[] = generateMockSubmissions(15)

// Function to get submissions for a specific project
export const getProjectSubmissions = (projectId: string): FormSubmission[] => {
  return mockSubmissions.filter((submission) => submission.projectId === projectId)
}

// Function to get a specific submission by ID
export const getSubmissionById = (submissionId: string): FormSubmission | undefined => {
  return mockSubmissions.find((submission) => submission.id === submissionId)
}

// Function to get form details for a submission
export const getFormForSubmission = (submission: FormSubmission) => {
  return mockForms.find((form) => form.id === submission.formId)
}

