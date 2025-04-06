/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import FormBuilder, { type FormData as ComponentFormData } from "@/components/form-builder"
import { createProject, validateStep, saveForm, removeForm } from "./actions"
import type { FormData as DomainFormData } from "@/domains/types"

const dataTypes = ["Photos", "Videos", "Audios", "Forms"]

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  organizationName: z.string().min(2, "Organization name is required"),
  imageUrl: z.string().url("Please enter a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  adminAddresses: z.array(z.string().min(1)).min(1, "At least one admin address is required"),
  validatorAddresses: z.array(z.string().min(1)),
  dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
  contactEmail: z.string().email("Please enter a valid email address"),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const [adminAddresses, setAdminAddresses] = useState<string[]>([""])
  const [validatorAddresses, setValidatorAddresses] = useState<string[]>([""])
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [customForms, setCustomForms] = useState<ComponentFormData[]>([])
  const [currentFormIndex, setCurrentFormIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stepValidationErrors, setStepValidationErrors] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      adminAddresses: [""],
      validatorAddresses: [""],
      dataTypes: [],
    },
  })

  // Watch dataTypes to keep UI in sync
  const watchedDataTypes = watch("dataTypes")

  const addAdminAddress = () => {
    setAdminAddresses([...adminAddresses, ""])
  }

  const removeAdminAddress = (index: number) => {
    if (adminAddresses.length > 1) {
      const newAddresses = adminAddresses.filter((_, i) => i !== index)
      setAdminAddresses(newAddresses)

      // Update form values
      setValue("adminAddresses", newAddresses)
    }
  }

  const addValidatorAddress = () => {
    setValidatorAddresses([...validatorAddresses, ""])
  }

  const removeValidatorAddress = (index: number) => {
    if (validatorAddresses.length > 1) {
      const newAddresses = validatorAddresses.filter((_, i) => i !== index)
      setValidatorAddresses(newAddresses)

      // Update form values
      setValue("validatorAddresses", newAddresses)
    }
  }

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...selectedDataTypes, dataType]
      : selectedDataTypes.filter((type) => type !== dataType)

    setSelectedDataTypes(updatedTypes)
    setValue("dataTypes", updatedTypes)
  }

  const addCustomForm = () => {
    // Create a new form and add it to the array
    setCurrentFormIndex(customForms.length)
    const newForm: ComponentFormData = {
      name: "",
      fields: [],
      prizePool: 10000,
      requiredElements: 100,
    }
    setCustomForms([...customForms, newForm])
  }

  // Convert component FormData to domain FormData
  const convertToDomainFormData = (form: ComponentFormData): Omit<DomainFormData, 'projectId'> => {
    const { fields, ...rest } = form
    
    // Ensure fields have the correct type format
    const convertedFields = fields.map(field => ({
      ...field,
      // Ensure type is one of the allowed types in the domain
      type: field.type as "text" | "number" | "email" | "date" | "select" | "checkbox" | "radio" | "file" | "textarea", 
    }))
    
    return {
      ...rest,
      fields: convertedFields
    }
  }

  const updateCustomForm = async (formData: ComponentFormData) => {
    try {
      // For server actions, add a temporary projectId that will be replaced server-side
      const domainFormData = {
        ...convertToDomainFormData(formData),
        projectId: "temp-id"
      }
      
      const domainForms = customForms.map(form => ({
        ...convertToDomainFormData(form),
        projectId: "temp-id"
      }))
      
      const result = await saveForm(
        domainFormData, 
        domainForms, 
        currentFormIndex
      )

      if (result.success && result.forms) {
        // Convert domain form data back to component form data
        const componentForms: ComponentFormData[] = result.forms.map(form => {
          // Cast the form object directly to ComponentFormData
          return form as unknown as ComponentFormData
        })
        
        setCustomForms(componentForms)
        setCurrentFormIndex(null) // Reset current form index after saving
        toast.success("Form saved successfully!")
      } else {
        if (result.error) {
          // Handle validation errors
          toast.error("Please fix the form errors")
        } else {
          toast.error(result.error?.toString() || "Failed to save form")
        }
      }
    } catch (error) {
      console.error("Error saving form:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const handleRemoveForm = async (index: number) => {
    try {
      // For server actions, add a temporary projectId that will be replaced server-side
      const domainForms = customForms.map(form => ({
        ...convertToDomainFormData(form),
        projectId: "temp-id"
      }))
      
      const result = await removeForm(domainForms, index)

      if (result.success && result.forms) {
        // Convert domain form data back to component form data
        const componentForms: ComponentFormData[] = result.forms.map(form => {
          // Cast the form to ComponentFormData without destructuring
          return form as unknown as ComponentFormData
        })
        
        setCustomForms(componentForms)
        if (currentFormIndex === index) {
          setCurrentFormIndex(null)
        } else if (currentFormIndex !== null && currentFormIndex > index) {
          setCurrentFormIndex(currentFormIndex - 1)
        }
        toast.success("Form removed successfully!")
      } else {
        toast.error(result.error?.toString() || "Failed to remove form")
      }
    } catch (error) {
      console.error("Error removing form:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const validateCurrentStep = async () => {
    // Always return true to skip validation
    return true
  }

  const nextStep = () => {
    // Make this a synchronous function without validation
    console.log("Moving to next step:", currentStep + 1)
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const onSubmit = async (data: ProjectFormValues) => {
    
    try {
      setIsSubmitting(true)

      // Final validation for the last step
      console.log("Running final validation in step:", currentStep)
      const isValid = true // Skip validation
      console.log("Validation result:", isValid)

      if (!isValid) {
        console.log("Validation failed:", stepValidationErrors)
        toast.error("Form validation failed - check console for details")
        setIsSubmitting(false)
        return
      }

      // Prepare the complete project data with forms
      // The forms will be added to the project by the server action
      const projectData = {
        ...data,
        forms: customForms.map(form => ({
          ...convertToDomainFormData(form),
          projectId: "temp-id" // This will be replaced on the server
        }))
      }

      // Submit the project
      const result = await createProject(projectData)

      if (result.success) {
        toast.success("Project created successfully!")
        // Navigate to the new project page using the router
        router.push(`/project/${result.project.id}`)
      } else {
        if (result.error) {
          toast.error(`${result.error}`)
        } else {
          toast.error(result.error?.toString() || "Failed to create project")
        }
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error(typeof error === 'string' ? error : "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  // Calculate total prize pool from all forms
  const totalPrizePool = customForms.reduce((total, form) => {
    return total + (form.prizePool || 0)
  }, 0)

  return (
    <div className="container py-8 md:py-12">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-muted-foreground mb-8">
          Launch your health data collection project on the Quorion platform.
        </p>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                >
                  1
                </div>
                <span
                  className={`text-xs mt-2 ${currentStep === 1 ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  Project Details
                </span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                >
                  2
                </div>
                <span
                  className={`text-xs mt-2 ${currentStep === 2 ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  Data Collection
                </span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
                <span
                  className={`text-xs mt-2 ${currentStep === 3 ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  Custom Forms
                </span>
              </div>
            </div>
          </div>
        </div>

        <form 
          // Prevent default form submission behavior on the entire form
          onSubmit={(e) => {
            e.preventDefault(); // Add this to explicitly prevent form submission
            console.log("Form submit event fired");
            // Only process submission on final step
            if (currentStep === 3) {
              handleSubmit(onSubmit)(e);
            }
          }} 
          className="space-y-8"
        >
          {currentStep === 1 && (
            <>
              <div className="glass-card rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter project name"
                      {...register("name")}
                      className={cn("border-2", errors.name ? "border-destructive" : "border-input")}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      placeholder="Enter organization name"
                      {...register("organizationName")}
                      className={cn("border-2", errors.organizationName ? "border-destructive" : "border-input")}
                    />
                    {errors.organizationName && (
                      <p className="text-destructive text-sm mt-1">{errors.organizationName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Project Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      {...register("imageUrl")}
                      className={cn("border-2", errors.imageUrl ? "border-destructive" : "border-input")}
                    />
                    {errors.imageUrl && <p className="text-destructive text-sm mt-1">{errors.imageUrl.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project and its goals"
                      rows={4}
                      {...register("description")}
                      className={cn("border-2", errors.description ? "border-destructive" : "border-input")}
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Team & Access Control</h2>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Admin Addresses</Label>
                    {adminAddresses.map((_, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="0x..."
                          {...register(`adminAddresses.${index}` as const)}
                          className={cn(
                            "border-2",
                            errors.adminAddresses?.[index] ? "border-destructive" : "border-input",
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeAdminAddress(index)}
                          disabled={adminAddresses.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addAdminAddress} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Admin
                    </Button>
                    {errors.adminAddresses && (
                      <p className="text-destructive text-sm mt-1">{errors.adminAddresses.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block">Validator Addresses</Label>
                    {validatorAddresses.map((_, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="0x..."
                          {...register(`validatorAddresses.${index}` as const)}
                          className={cn(
                            "border-2",
                            errors.validatorAddresses?.[index] ? "border-destructive" : "border-input",
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeValidatorAddress(index)}
                          disabled={validatorAddresses.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addValidatorAddress} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Validator
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="glass-card rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold">Data Collection</h2>

              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Data Types</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {dataTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dataType-${type}`}
                          checked={watchedDataTypes?.includes(type)}
                          onCheckedChange={(checked) => handleDataTypeChange(type, checked === true)}
                          className="border-2 border-input data-[state=checked]:border-primary"
                        />
                        <Label htmlFor={`dataType-${type}`}>{type}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.dataTypes && <p className="text-destructive text-sm mt-1">{errors.dataTypes.message}</p>}
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="contact@organization.com"
                      {...register("contactEmail")}
                      className={cn("border-2", errors.contactEmail ? "border-destructive" : "border-input")}
                    />
                    {errors.contactEmail && (
                      <p className="text-destructive text-sm mt-1">{errors.contactEmail.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div
              className="glass-card rounded-xl p-6 space-y-6 relative border-primary/30 shadow-md"
              style={{ zIndex: 10 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Custom Data Collection Forms</h2>
                <Button type="button" variant="default" onClick={addCustomForm} className="bg-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Form
                </Button>
              </div>

              {customForms.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground mb-4">No custom forms created yet.</p>
                  <Button type="button" variant="default" onClick={addCustomForm} className="bg-primary text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Form
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Prize Pool:</span>
                      <span className="text-xl font-bold">${totalPrizePool.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {customForms.map((form, index) => (
                      <div key={index} className="border-2 border-primary/40 rounded-lg p-6 bg-card/90 shadow-md">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-lg text-primary">
                            Form {index + 1}: {form.name || "Untitled Form"}
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveForm(index)}
                            className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Form
                          </Button>
                        </div>

                        <FormBuilder initialData={form} onSaveAction={(formData) => updateCustomForm(formData)} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <Button type="button" variant="outline" asChild>
                <Link href="/projects">Cancel</Link>
              </Button>
            )}

            {currentStep < 3 ? (
              <Button 
                type="button" 
                variant="default" 
                onClick={(e) => {
                  e.preventDefault(); // Prevent any form submission
                  nextStep();
                }}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button" // Change to button type instead of implicit submit
                variant="default" 
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Submit button clicked");
                  handleSubmit(onSubmit)(e);
                }}
              >
                {isSubmitting ? "Creating Project..." : "Create Project"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

