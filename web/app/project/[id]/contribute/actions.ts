"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { FormSubmission } from "@/domains/types"

export async function submitFormData(projectId: string, data: FormSubmission) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    // if (!response.ok) {
    //   const errorData = await response.json()
    //   throw new Error(errorData.error || "Failed to submit form")
    // }

    const result = await response.json()

    // Revalidate the project page
    revalidatePath(`/project/${projectId}`)

    // Redirect back to the project page
    redirect(`/project/${projectId}`)
  } catch (error) {
    console.error("Error submitting form:", error)
    throw new Error("Failed to submit form. Please try again.")
  }
}

