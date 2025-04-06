"use server"

import { revalidatePath } from "next/cache"
import type { ValidationNote } from "@/domains/types"

export async function validateSubmission(projectId: string, data: ValidationNote) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    // if (!response.ok) {
    //   const errorData = await response.json()
    //   throw new Error(errorData.error || "Failed to validate submission")
    // }

    const result = await response.json()

    // Revalidate the validator page
    revalidatePath(`/project/${projectId}/validator`)

    return result
  } catch (error) {
    console.error("Error validating submission:", error)
    throw new Error("Failed to validate submission. Please try again.")
  }
}

