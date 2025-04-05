/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { FormField } from "@/components/form-builder"

interface FormRendererProps {
  form: {
    id: string
    name: string
    description?: string
    fields: FormField[]
  }
  onSubmitAction: (data: any) => Promise<void>
}

export default function FormRenderer({ form, onSubmitAction }: FormRendererProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<Record<string, File[]>>({})

  // Dynamically build the validation schema based on form fields
  const buildValidationSchema = () => {
    const schema: Record<string, any> = {}

    form.fields.forEach((field) => {
      let fieldSchema

      switch (field.type) {
        case "text":
          fieldSchema = z.string()
          if (field.required) fieldSchema = fieldSchema.min(1, "This field is required")
          break
        case "email":
          fieldSchema = z.string()
          if (field.required) fieldSchema = fieldSchema.min(1, "This field is required").email("Invalid email address")
          else fieldSchema = fieldSchema.email("Invalid email address").optional()
          break
        case "number":
          fieldSchema = z.string().transform((val) => (val === "" ? undefined : Number(val)))
          if (field.required) fieldSchema = fieldSchema.refine((val) => val !== undefined, "This field is required")
          break
        case "date":
          fieldSchema = z.string()
          if (field.required) fieldSchema = fieldSchema.min(1, "This field is required")
          break
        case "select":
          fieldSchema = z.string()
          if (field.required) fieldSchema = fieldSchema.min(1, "This field is required")
          break
        case "checkbox":
          fieldSchema = z.array(z.string())
          if (field.required) fieldSchema = fieldSchema.min(1, "Please select at least one option")
          break
        case "radio":
          fieldSchema = z.string()
          if (field.required) fieldSchema = fieldSchema.min(1, "This field is required")
          break
        case "file":
          // File validation is handled separately
          fieldSchema = z.any()
          break
        default:
          fieldSchema = z.string()
          if (field.required) fieldSchema = fieldSchema.min(1, "This field is required")
      }

      schema[field.id] = fieldSchema
    })

    return z.object(schema)
  }

  const validationSchema = buildValidationSchema()
  type FormValues = z.infer<typeof validationSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
  })

  const handleFileChange = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fieldFiles = Array.from(e.target.files)
      setFiles((prev) => ({
        ...prev,
        [fieldId]: fieldFiles,
      }))
    }
  }

  const handleFormSubmit = async (data: FormValues) => {
    // Validate file fields
    let fileValidationError = false
    form.fields.forEach((field) => {
      if (field.type === "file" && field.required) {
        if (!files[field.id] || files[field.id].length === 0) {
          fileValidationError = true
          toast.error(`Please upload ${field.label}`)
        }
      }
    })

    if (fileValidationError) return

    setIsSubmitting(true)

    try {
      // Combine form data with files
      const formData = {
        ...data,
        files,
      }

      await onSubmitAction(formData)
      toast.success("Form submitted successfully!")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Error submitting form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-bold mb-2">{form.name}</h2>
      {form.description && <p className="text-muted-foreground mb-6">{form.description}</p>}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {field.type === "text" && (
              <Input id={field.id} {...register(field.id)} className={errors[field.id] ? "border-destructive" : ""} />
            )}

            {field.type === "email" && (
              <Input
                id={field.id}
                type="email"
                {...register(field.id)}
                className={errors[field.id] ? "border-destructive" : ""}
              />
            )}

            {field.type === "number" && (
              <Input
                id={field.id}
                type="number"
                {...register(field.id)}
                className={errors[field.id] ? "border-destructive" : ""}
              />
            )}

            {field.type === "date" && (
              <Input
                id={field.id}
                type="date"
                {...register(field.id)}
                className={errors[field.id] ? "border-destructive" : ""}
              />
            )}

            {field.type === "text" && (
              <Textarea
                id={field.id}
                {...register(field.id)}
                className={errors[field.id] ? "border-destructive" : ""}
                rows={4}
              />
            )}

            {field.type === "select" && field.options && (
              <select
                id={field.id}
                {...register(field.id)}
                className={`w-full rounded-md border ${errors[field.id] ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm`}
              >
                <option value="">Select an option</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {field.type === "checkbox" && field.options && (
              <div className="space-y-2">
                {field.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`${field.id}-${index}`} value={option} {...register(field.id)} />
                    <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

            {field.type === "radio" && field.options && (
              <RadioGroup onValueChange={(value) => setValue(field.id, value)} defaultValue={watch(field.id)}>
                {field.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem id={`${field.id}-${index}`} value={option} {...register(field.id)} />
                    <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {field.type === "file" && (
              <div>
                <Input
                  id={field.id}
                  type="file"
                  accept={field.fileTypes?.join(",")}
                  multiple={field.maxFiles ? field.maxFiles > 1 : false}
                  onChange={(e) => handleFileChange(field.id, e)}
                  className={errors[field.id] ? "border-destructive" : ""}
                />
                {field.fileTypes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted file types: {field.fileTypes.join(", ")}
                  </p>
                )}
                {field.maxFiles && field.maxFiles > 1 && (
                  <p className="text-xs text-muted-foreground mt-1">Maximum {field.maxFiles} files</p>
                )}
                {files[field.id] && files[field.id].length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Selected files:</p>
                    <ul className="text-sm text-muted-foreground">
                      {files[field.id].map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {errors[field.id] && <p className="text-destructive text-sm">{errors[field.id]?.message?.toString()}</p>}
          </div>
        ))}

        <Button type="submit" disabled={isSubmitting} variant="default" className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Data"}
        </Button>
      </form>
    </div>
  )
}

