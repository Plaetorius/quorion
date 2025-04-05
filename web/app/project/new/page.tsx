"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const dataTypes = ["Photos", "Videos", "Audios", "Forms"]

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  organizationName: z.string().min(2, "Organization name is required"),
  imageUrl: z.string().url("Please enter a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  adminAddresses: z.array(z.string().min(1)).min(1, "At least one admin address is required"),
  validatorAddresses: z.array(z.string().min(1)),
  dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
  requiredElements: z.number().min(1, "Required elements must be at least 1"),
  totalPrizePool: z.number().min(1, "Prize pool must be at least 1"),
  contactEmail: z.string().email("Please enter a valid email address"),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const [adminAddresses, setAdminAddresses] = useState<string[]>([""])
  const [validatorAddresses, setValidatorAddresses] = useState<string[]>([""])
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      adminAddresses: [""],
      validatorAddresses: [""],
      dataTypes: [],
      requiredElements: 1000,
      totalPrizePool: 10000,
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

  const onSubmit = (data: ProjectFormValues) => {
    // In a real app, this would send the data to an API
    console.log(data)
    toast.success("Project created successfully!")
    // Redirect would happen here
  }

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="glass-card rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  placeholder="Enter organization name"
                  {...register("organizationName")}
                  className={errors.organizationName ? "border-destructive" : ""}
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
                  className={errors.imageUrl ? "border-destructive" : ""}
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
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
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
                      className={errors.adminAddresses?.[index] ? "border-destructive" : ""}
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
                      className={errors.validatorAddresses?.[index] ? "border-destructive" : ""}
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
                      />
                      <Label htmlFor={`dataType-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
                {errors.dataTypes && <p className="text-destructive text-sm mt-1">{errors.dataTypes.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requiredElements">Required Elements</Label>
                  <Input
                    id="requiredElements"
                    type="number"
                    min="1"
                    {...register("requiredElements", { valueAsNumber: true })}
                    className={errors.requiredElements ? "border-destructive" : ""}
                  />
                  {errors.requiredElements && (
                    <p className="text-destructive text-sm mt-1">{errors.requiredElements.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="totalPrizePool">Total Prize Pool ($)</Label>
                  <Input
                    id="totalPrizePool"
                    type="number"
                    min="1"
                    {...register("totalPrizePool", { valueAsNumber: true })}
                    className={errors.totalPrizePool ? "border-destructive" : ""}
                  />
                  {errors.totalPrizePool && (
                    <p className="text-destructive text-sm mt-1">{errors.totalPrizePool.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@organization.com"
                {...register("contactEmail")}
                className={errors.contactEmail ? "border-destructive" : ""}
              />
              {errors.contactEmail && <p className="text-destructive text-sm mt-1">{errors.contactEmail.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/projects">Cancel</Link>
            </Button>
            <Button type="submit" variant="glow">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

