/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export interface FormField {
  id: string
  label: string
  type: string
  required: boolean
  order: number
  options?: string[]
  fileTypes?: string[]
  maxFiles?: number
}

export interface FormData {
  name: string
  description?: string
  requiredElements?: number
  prizePool?: number
  fields: FormField[]
}

interface FormBuilderProps {
  initialData?: FormData
  onSaveAction: (formData: FormData) => void
}

const fieldTypeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "file", label: "File Upload" },
]

const fileTypeOptions = [
  { value: "image/*", label: "Images" },
  { value: "video/*", label: "Videos" },
  { value: "audio/*", label: "Audio" },
  { value: "application/pdf", label: "PDF Documents" },
  { value: "text/*", label: "Text Files" },
]

const formSchema = z.object({
  name: z.string().min(3, "Form name must be at least 3 characters"),
  description: z.string().optional(),
  requiredElements: z.number().min(1, "Required elements must be at least 1").optional(),
  prizePool: z.number().min(0, "Prize pool must be a positive number").optional(),
  fields: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      required: z.boolean(),
      order: z.number(),
      options: z.array(z.string()).optional(),
      fileTypes: z.array(z.string()).optional(),
      maxFiles: z.number().optional(),
    }),
  ),
})

export default function FormBuilder({ initialData, onSaveAction }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialData?.fields || [])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [collapsedFields, setCollapsedFields] = useState<Record<string, boolean>>({})
  const [draggedField, setDraggedField] = useState<string | null>(null)

  // Refs for drag and drop
  const dragSourceIndex = useRef<number | null>(null)
  const dragOverIndex = useRef<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      requiredElements: initialData?.requiredElements || 100,
      prizePool: initialData?.prizePool || 10000,
    },
  })

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: "",
      type: "text",
      required: false,
      order: fields.length,
    }
    setFields([...fields, newField])
  }

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
    // Also remove from collapsed state
    const newCollapsedFields = { ...collapsedFields }
    delete newCollapsedFields[id]
    setCollapsedFields(newCollapsedFields)
  }

  const handleFieldChange = (id: string, key: keyof FormField, value: any) => {
    setFields(
      fields.map((field) => {
        if (field.id === id) {
          return { ...field, [key]: value }
        }
        return field
      }),
    )
  }

  const handleAddOption = (fieldId: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          const options = field.options || []
          return { ...field, options: [...options, ""] }
        }
        return field
      }),
    )
  }

  const handleRemoveOption = (fieldId: string, optionIndex: number) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId && field.options) {
          const options = [...field.options]
          options.splice(optionIndex, 1)
          return { ...field, options }
        }
        return field
      }),
    )
  }

  const handleOptionChange = (fieldId: string, optionIndex: number, value: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId && field.options) {
          const options = [...field.options]
          options[optionIndex] = value
          return { ...field, options }
        }
        return field
      }),
    )
  }

  const handleAddFileType = (fieldId: string, fileType: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          const fileTypes = field.fileTypes || []
          if (!fileTypes.includes(fileType)) {
            return { ...field, fileTypes: [...fileTypes, fileType] }
          }
        }
        return field
      }),
    )
  }

  const handleRemoveFileType = (fieldId: string, fileType: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId && field.fileTypes) {
          return { ...field, fileTypes: field.fileTypes.filter((type) => type !== fileType) }
        }
        return field
      }),
    )
  }

  const handleMaxFilesChange = (fieldId: string, value: number) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          return { ...field, maxFiles: value }
        }
        return field
      }),
    )
  }

  const handleMoveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length) return

    const newFields = [...fields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)

    // Update order property
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index,
    }))

    setFields(updatedFields)
  }

  const handleToggleDropdown = (id: string) => {
    // Clear any existing timeout
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }

    if (activeDropdown === id) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(id)
    }
  }

  const handleSaveForm = (data: FormData) => {
    // Ensure all fields have an order property
    const fieldsWithOrder = fields.map((field, index) => ({
      ...field,
      order: field.order || index,
    }))

    // Create the complete form data
    const completeFormData = {
      ...data,
      fields: fieldsWithOrder,
    }

    // Call the onSaveAction callback with the complete form data
    onSaveAction(completeFormData)
  }

  const toggleFieldCollapse = (fieldId: string) => {
    setCollapsedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number, fieldId: string) => {
    dragSourceIndex.current = index
    setDraggedField(fieldId)

    // Set the drag image to be the entire field card
    const fieldElement = document.getElementById(`field-${fieldId}`)
    if (fieldElement) {
      // Create a ghost image that's slightly transparent
      const rect = fieldElement.getBoundingClientRect()
      const ghostElement = fieldElement.cloneNode(true) as HTMLElement
      ghostElement.style.width = `${rect.width}px`
      ghostElement.style.opacity = "0.6"
      ghostElement.style.position = "absolute"
      ghostElement.style.top = "-1000px"
      ghostElement.style.backgroundColor = "rgba(59, 130, 246, 0.1)"
      ghostElement.style.border = "2px dashed #3b82f6"
      document.body.appendChild(ghostElement)

      e.dataTransfer.setDragImage(ghostElement, 20, 20)

      // Remove the ghost element after a short delay
      setTimeout(() => {
        document.body.removeChild(ghostElement)
      }, 0)
    }

    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    dragOverIndex.current = index

    // Add visual indicator for drop target
    const fieldElements = document.querySelectorAll(".field-card")
    fieldElements.forEach((el, i) => {
      if (i === index) {
        el.classList.add("border-primary")
        el.classList.add("bg-primary/5")
      } else {
        el.classList.remove("border-primary")
        el.classList.remove("bg-primary/5")
      }
    })
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault()

    // Remove all visual indicators
    const fieldElements = document.querySelectorAll(".field-card")
    fieldElements.forEach((el) => {
      el.classList.remove("border-primary")
      el.classList.remove("bg-primary/5")
    })

    // Move the field if both source and target indices are valid
    if (
      dragSourceIndex.current !== null &&
      dragOverIndex.current !== null &&
      dragSourceIndex.current !== dragOverIndex.current
    ) {
      handleMoveField(dragSourceIndex.current, dragOverIndex.current)
    }

    // Reset drag state
    dragSourceIndex.current = null
    dragOverIndex.current = null
    setDraggedField(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Form Name</Label>
            <Input
              id="name"
              placeholder="Enter form name"
              {...register("name")}
              className={cn("border-2", errors.name ? "border-destructive" : "border-input")}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter form description"
              rows={3}
              {...register("description")}
              className="border-2 border-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requiredElements">Required Elements</Label>
              <Input
                id="requiredElements"
                type="number"
                min="1"
                placeholder="Number of required submissions"
                {...register("requiredElements", { valueAsNumber: true })}
                className={cn("border-2", errors.requiredElements ? "border-destructive" : "border-input")}
              />
              {errors.requiredElements && (
                <p className="text-destructive text-sm mt-1">{errors.requiredElements.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">The number of submissions required for this form</p>
            </div>

            <div>
              <Label htmlFor="prizePool">Prize Pool ($)</Label>
              <Input
                id="prizePool"
                type="number"
                min="0"
                placeholder="Total prize pool for this form"
                {...register("prizePool", { valueAsNumber: true })}
                className={cn("border-2", errors.prizePool ? "border-destructive" : "border-input")}
              />
              {errors.prizePool && <p className="text-destructive text-sm mt-1">{errors.prizePool.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">The total prize pool allocated for this form</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Form Fields</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No fields added yet.</p>
              <Button type="button" variant="outline" onClick={handleAddField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Field
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  id={`field-${field.id}`}
                  className={cn(
                    "border-2 border-primary/30 bg-card/80 rounded-lg p-4 relative field-card transition-all shadow-sm",
                    draggedField === field.id && "opacity-50 border-dashed border-primary",
                    !collapsedFields[field.id] && "border-primary/50 shadow-md",
                  )}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index, field.id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="cursor-move p-1 text-primary/70 hover:text-primary" aria-label="Drag to reorder">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="ml-2">
                        <h4 className="font-medium text-primary">Field {index + 1}</h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          {fieldTypeOptions.find((opt) => opt.value === field.type)?.label || field.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 mr-1"
                        onClick={() => toggleFieldCollapse(field.id)}
                        aria-label={collapsedFields[field.id] ? "Expand field" : "Collapse field"}
                      >
                        {collapsedFields[field.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleRemoveField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {!collapsedFields[field.id] && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`${field.id}-label`}>Field Label</Label>
                        <Input
                          id={`${field.id}-label`}
                          value={field.label}
                          onChange={(e) => handleFieldChange(field.id, "label", e.target.value)}
                          placeholder="Enter field label"
                          className="border-2 border-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <Label htmlFor={`${field.id}-type`}>Field Type</Label>
                          <div className="relative">
                            <button
                              type="button"
                              id={`${field.id}-type`}
                              className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm border-2 border-primary/50 rounded-md bg-background hover:border-primary focus:border-primary transition-colors"
                              onClick={() => handleToggleDropdown(`${field.id}-type`)}
                            >
                              <span>
                                {fieldTypeOptions.find((option) => option.value === field.type)?.label || "Select type"}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                            {activeDropdown === `${field.id}-type` && (
                              <div className="absolute z-50 w-full mt-1 bg-popover shadow-md rounded-md border-2 border-input overflow-hidden">
                                <div className="max-h-[200px] overflow-y-auto">
                                  {fieldTypeOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      type="button"
                                      className={cn(
                                        "w-full px-3 py-2 text-sm text-left hover:bg-primary/20 hover:text-primary",
                                        field.type === option.value && "bg-primary/30 text-primary font-medium",
                                      )}
                                      onClick={() => {
                                        handleFieldChange(field.id, "type", option.value)
                                        // Use a longer timeout before closing the dropdown
                                        const timeout = setTimeout(() => {
                                          setActiveDropdown(null)
                                        }, 500)
                                        setDropdownTimeout(timeout)
                                      }}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id={`${field.id}-required`}
                            checked={field.required}
                            onCheckedChange={(checked) => handleFieldChange(field.id, "required", checked)}
                            className="border-2 border-input data-[state=unchecked]:border-input"
                          />
                          <Label htmlFor={`${field.id}-required`}>Required Field</Label>
                        </div>
                      </div>

                      {/* Options for select, checkbox, radio */}
                      {(field.type === "select" || field.type === "checkbox" || field.type === "radio") && (
                        <div>
                          <Label className="mb-2 block">Options</Label>
                          <div className="space-y-2">
                            {(field.options || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => handleOptionChange(field.id, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="border-2 border-input"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-10 w-10 p-0 text-destructive"
                                  onClick={() => handleRemoveOption(field.id, optionIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddOption(field.id)}
                              className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* File upload settings */}
                      {field.type === "file" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-2 block">Accepted File Types</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(field.fileTypes || []).map((fileType) => (
                                <div
                                  key={fileType}
                                  className="bg-primary/20 text-primary px-2 py-1 rounded-md text-sm flex items-center border border-primary/40 font-medium"
                                >
                                  <span>
                                    {fileTypeOptions.find((option) => option.value === fileType)?.label || fileType}
                                  </span>
                                  <button
                                    type="button"
                                    className="ml-1 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleRemoveFileType(field.id, fileType)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="relative">
                              <button
                                type="button"
                                className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm border-2 border-primary/50 rounded-md bg-background hover:border-primary focus:border-primary transition-colors"
                                onClick={() => handleToggleDropdown(`${field.id}-filetype`)}
                              >
                                <span>Add file type</span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </button>
                              {activeDropdown === `${field.id}-filetype` && (
                                <div className="absolute z-50 w-full mt-1 bg-popover shadow-md rounded-md border-2 border-input overflow-hidden">
                                  <div className="max-h-[200px] overflow-y-auto">
                                    {fileTypeOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        className={cn(
                                          "w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground",
                                          field.fileTypes?.includes(option.value) && "bg-accent/50",
                                        )}
                                        onClick={() => {
                                          handleAddFileType(field.id, option.value)
                                          // Use a longer timeout before closing the dropdown
                                          const timeout = setTimeout(() => {
                                            setActiveDropdown(null)
                                          }, 500)
                                          setDropdownTimeout(timeout)
                                        }}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`${field.id}-maxfiles`}>Maximum Files</Label>
                            <Input
                              id={`${field.id}-maxfiles`}
                              type="number"
                              min="1"
                              value={field.maxFiles || 1}
                              onChange={(e) => handleMaxFilesChange(field.id, Number.parseInt(e.target.value))}
                              className="border-2 border-input"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="default" onClick={handleSubmit(handleSaveForm)} className="px-6">
            Save Form
          </Button>
        </div>
      </div>
    </div>
  )
}

