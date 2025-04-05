"use client"

import { useState } from "react"
import {
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Calendar,
  CheckSquare,
  List,
  Type,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export type FieldType = "text" | "number" | "email" | "date" | "select" | "checkbox" | "radio" | "file"

export interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  order: number
  options?: string[] // For select, checkbox, radio fields
  fileTypes?: string[] // For file fields
  maxFiles?: number // For file fields
}

export interface FormData {
  name: string
  description?: string
  fields: FormField[]
}

interface FormBuilderProps {
  initialData?: FormData
  onSaveAction: (formData: FormData) => void
}

export default function FormBuilder({ initialData, onSaveAction }: FormBuilderProps) {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      name: "",
      description: "",
      fields: [],
    },
  )

  const [activeField, setActiveField] = useState<string | null>(null)

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: getDefaultLabel(type),
      type,
      required: false,
      order: formData.fields.length,
      ...(type === "select" || type === "checkbox" || type === "radio" ? { options: ["Option 1"] } : {}),
      ...(type === "file" ? { fileTypes: ["image/*"], maxFiles: 1 } : {}),
    }

    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    })
    setActiveField(newField.id)
  }

  const getDefaultLabel = (type: FieldType): string => {
    switch (type) {
      case "text":
        return "Text Field"
      case "number":
        return "Number Field"
      case "email":
        return "Email Address"
      case "date":
        return "Date"
      case "select":
        return "Dropdown"
      case "checkbox":
        return "Checkbox Group"
      case "radio":
        return "Radio Group"
      case "file":
        return "File Upload"
      default:
        return "New Field"
    }
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
    })
  }

  const removeField = (id: string) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((field) => field.id !== id),
    })
    if (activeField === id) {
      setActiveField(null)
    }
  }

  const addOption = (fieldId: string) => {
    const field = formData.fields.find((f) => f.id === fieldId)
    if (field && field.options) {
      const newOptions = [...field.options, `Option ${field.options.length + 1}`]
      updateField(fieldId, { options: newOptions })
    }
  }

  const updateOption = (fieldId: string, index: number, value: string) => {
    const field = formData.fields.find((f) => f.id === fieldId)
    if (field && field.options) {
      const newOptions = [...field.options]
      newOptions[index] = value
      updateField(fieldId, { options: newOptions })
    }
  }

  const removeOption = (fieldId: string, index: number) => {
    const field = formData.fields.find((f) => f.id === fieldId)
    if (field && field.options) {
      const newOptions = field.options.filter((_, i) => i !== index)
      updateField(fieldId, { options: newOptions })
    }
  }

  const updateFileTypes = (fieldId: string, types: string[]) => {
    updateField(fieldId, { fileTypes: types })
  }

  const handleSubmit = () => {
    onSaveAction(formData)
  }

  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "number":
        return <Hash className="h-4 w-4" />
      case "email":
        return <FileText className="h-4 w-4" />
      case "date":
        return <Calendar className="h-4 w-4" />
      case "select":
        return <List className="h-4 w-4" />
      case "checkbox":
        return <CheckSquare className="h-4 w-4" />
      case "radio":
        return <CheckSquare className="h-4 w-4" />
      case "file":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Form Details</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter form name"
            />
          </div>

          <div>
            <Label htmlFor="formDescription">Description</Label>
            <Textarea
              id="formDescription"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what data you're collecting and why"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Form Fields</h2>
          <div className="flex gap-2">
            <div className="relative group">
              <Button variant="outline" size="sm">
                Add Field <Plus className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border z-10 hidden group-hover:block">
                <div className="py-1">
                  <button
                    onClick={() => addField("text")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <Type className="mr-2 h-4 w-4" /> Text Field
                  </button>
                  <button
                    onClick={() => addField("number")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <Hash className="mr-2 h-4 w-4" /> Number Field
                  </button>
                  <button
                    onClick={() => addField("email")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Email Field
                  </button>
                  <button
                    onClick={() => addField("date")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <Calendar className="mr-2 h-4 w-4" /> Date Field
                  </button>
                  <button
                    onClick={() => addField("select")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <List className="mr-2 h-4 w-4" /> Dropdown
                  </button>
                  <button
                    onClick={() => addField("checkbox")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <CheckSquare className="mr-2 h-4 w-4" /> Checkbox Group
                  </button>
                  <button
                    onClick={() => addField("radio")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <CheckSquare className="mr-2 h-4 w-4" /> Radio Group
                  </button>
                  <button
                    onClick={() => addField("file")}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" /> File Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {formData.fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No fields added yet. Click &quot;Add Field&quot; to start building your form.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all",
                  activeField === field.id ? "border-primary" : "border-border",
                )}
                onClick={() => setActiveField(field.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div className="flex items-center gap-1.5">
                      {getFieldIcon(field.type)}
                      <span className="font-medium">{field.label}</span>
                    </div>
                    {field.required && <span className="text-xs text-destructive">*</span>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeField(field.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {activeField === field.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div>
                      <Label htmlFor={`field-${field.id}-label`}>Field Label</Label>
                      <Input
                        id={`field-${field.id}-label`}
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field.id}-required`}
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(field.id, { required: checked === true })}
                        />
                        <Label htmlFor={`field-${field.id}-required`}>Required field</Label>
                      </div>
                    </div>

                    {(field.type === "select" || field.type === "checkbox" || field.type === "radio") &&
                      field.options && (
                        <div className="space-y-2">
                          <Label>Options</Label>
                          {field.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(field.id, index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(field.id, index)}
                                disabled={field.options?.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => addOption(field.id)} className="mt-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Option
                          </Button>
                        </div>
                      )}

                    {field.type === "file" && (
                      <div className="space-y-4">
                        <div>
                          <Label>File Types</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`field-${field.id}-images`}
                                checked={field.fileTypes?.includes("image/*")}
                                onCheckedChange={(checked) => {
                                  const currentTypes = field.fileTypes || []
                                  const newTypes = checked
                                    ? [...currentTypes, "image/*"]
                                    : currentTypes.filter((t) => t !== "image/*")
                                  updateFileTypes(field.id, newTypes)
                                }}
                              />
                              <Label htmlFor={`field-${field.id}-images`} className="flex items-center">
                                <ImageIcon className="mr-2 h-4 w-4" /> Images
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`field-${field.id}-videos`}
                                checked={field.fileTypes?.includes("video/*")}
                                onCheckedChange={(checked) => {
                                  const currentTypes = field.fileTypes || []
                                  const newTypes = checked
                                    ? [...currentTypes, "video/*"]
                                    : currentTypes.filter((t) => t !== "video/*")
                                  updateFileTypes(field.id, newTypes)
                                }}
                              />
                              <Label htmlFor={`field-${field.id}-videos`} className="flex items-center">
                                <Video className="mr-2 h-4 w-4" /> Videos
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`field-${field.id}-audio`}
                                checked={field.fileTypes?.includes("audio/*")}
                                onCheckedChange={(checked) => {
                                  const currentTypes = field.fileTypes || []
                                  const newTypes = checked
                                    ? [...currentTypes, "audio/*"]
                                    : currentTypes.filter((t) => t !== "audio/*")
                                  updateFileTypes(field.id, newTypes)
                                }}
                              />
                              <Label htmlFor={`field-${field.id}-audio`} className="flex items-center">
                                <Mic className="mr-2 h-4 w-4" /> Audio
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`field-${field.id}-documents`}
                                checked={field.fileTypes?.includes(".pdf,.doc,.docx,.txt")}
                                onCheckedChange={(checked) => {
                                  const currentTypes = field.fileTypes || []
                                  const newTypes = checked
                                    ? [...currentTypes, ".pdf,.doc,.docx,.txt"]
                                    : currentTypes.filter((t) => t !== ".pdf,.doc,.docx,.txt")
                                  updateFileTypes(field.id, newTypes)
                                }}
                              />
                              <Label htmlFor={`field-${field.id}-documents`} className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" /> Documents
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`field-${field.id}-maxFiles`}>Maximum Files</Label>
                          <Input
                            id={`field-${field.id}-maxFiles`}
                            type="number"
                            min="1"
                            max="10"
                            value={field.maxFiles || 1}
                            onChange={(e) => updateField(field.id, { maxFiles: Number.parseInt(e.target.value) || 1 })}
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
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={formData.name.trim() === "" || formData.fields.length === 0}
        >
          Save Form
        </Button>
      </div>
    </div>
  )
}

