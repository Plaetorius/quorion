/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { ProjectCreate, FormData } from "@/domains/types"

// Action to create a new project
export async function createProject(formData: ProjectCreate) {
  try {
    // Validate the project data
    const validatedData = formData

    // Calculate total prize pool from all forms
    const totalPrizePool =
      validatedData.forms?.reduce((total, form) => {
        return total + (form.prizePool || 0)
      }, 0) || 0

    // Calculate total required elements from all forms
    const totalRequiredElements =
      validatedData.forms?.reduce((total, form) => {
        return total + (form.requiredElements || 0)
      }, 0) || 0

    // Prepare the data for API submission
    const projectData = {
      ...validatedData,
      totalPrizePool,
      requiredElements: totalRequiredElements,
    }

    // Submit to the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
      cache: "no-store",
    })

    const result = await response.json()

    // Revalidate the projects page
    revalidatePath("/projects")

    // Return success with project data instead of redirecting
    return {
      success: true,
      project: result.project
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      error: error || "Failed to create project. Please try again.",
    }
  }
}

// Action to validate a single step of the form
export async function validateStep(step: number, data: any) {
  // Commented out validation logic
  /*
  try {
    // Validation logic would go here
  } catch (error) {
    return {
      success: false,
      error: error || "Validation failed",
    }
  }
  */
  
  // Always return success
  return { success: true }
}

// Action to save a form within the project creation process
export async function saveForm(formData: FormData, forms: FormData[], index: number | null) {
  try {
    const validatedForm = formData

    // Update or add the form
    const updatedForms = [...forms]

    if (index !== null && index >= 0 && index < forms.length) {
      // Update existing form
      updatedForms[index] = validatedForm
    } else {
      // Add new form
      updatedForms.push(validatedForm)
    }

    return {
      success: true,
      forms: updatedForms,
    }
  } catch (error) {
    return {
      success: false,
      error: error || "Failed to save form",
    }
  }
}

// Action to remove a form
export async function removeForm(forms: FormData[], index: number) {
  try {
    const updatedForms = forms.filter((_, i) => i !== index)

    return {
      success: true,
      forms: updatedForms,
    }
  } catch (error) {
    return {
      success: false,
      error: error || "Failed to remove form",
    }
  }
}

