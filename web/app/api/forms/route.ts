import { type NextRequest, NextResponse } from "next/server"
import { formCreateSchema, formUpdateSchema } from "@/domains/schema"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the form data
    const validatedData = formCreateSchema.parse(data)

    // Create the form in the database
    const form = await prisma.form.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        projectId: validatedData.projectId,
        requiredElements: validatedData.requiredElements,
        prizePool: validatedData.prizePool,
        fields: {
          create: validatedData.fields.map((field, index) => ({
            label: field.label,
            type: field.type,
            required: field.required,
            order: field.order || index,
            options: field.options ? JSON.stringify(field.options) : null,
            fileTypes: field.fileTypes,
            maxFiles: field.maxFiles,
          })),
        },
      },
      include: {
        fields: true,
      },
    })

    return NextResponse.json({ success: true, form }, { status: 201 })
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json({ success: false, error: "Failed to create form" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the form data
    const validatedData = formUpdateSchema.parse(data)

    // Update the form in the database
    const form = await prisma.form.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        requiredElements: validatedData.requiredElements,
        prizePool: validatedData.prizePool,
      },
    })

    // Update fields - first delete existing fields
    await prisma.formField.deleteMany({
      where: { formId: validatedData.id },
    })

    // Then create new fields
    const fields = await prisma.formField.createMany({
      data: validatedData.fields.map((field, index) => ({
        formId: validatedData.id,
        label: field.label,
        type: field.type,
        required: field.required,
        order: field.order || index,
        options: field.options ? JSON.stringify(field.options) : null,
        fileTypes: field.fileTypes,
        maxFiles: field.maxFiles,
      })),
    })

    return NextResponse.json({ success: true, form, fields }, { status: 200 })
  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json({ success: false, error: "Failed to update form" }, { status: 500 })
  }
}

