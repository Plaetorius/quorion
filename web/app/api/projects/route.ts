import { type NextRequest, NextResponse } from "next/server"
import { projectCreateSchema, projectUpdateSchema } from "@/domains/schema"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the project data
    const validatedData = projectCreateSchema.parse(data)

    // Create the project in the database
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        organizationName: validatedData.organizationName,
        imageUrl: validatedData.imageUrl,
        description: validatedData.description,
        adminAddresses: validatedData.adminAddresses,
        validatorAddresses: validatedData.validatorAddresses,
        dataTypes: validatedData.dataTypes,
        requiredElements: validatedData.forms?.reduce((total, form) => total + (form.requiredElements || 0), 0) || 0,
        totalPrizePool: validatedData.forms?.reduce((total, form) => total + (form.prizePool || 0), 0) || 0,
        contactEmail: validatedData.contactEmail,
        collectedElements: 0,
        distributedPrizePool: 0,
      },
    })

    // Create forms if provided
    if (validatedData.forms && validatedData.forms.length > 0) {
      for (const formData of validatedData.forms) {
        await prisma.form.create({
          data: {
            name: formData.name,
            description: formData.description,
            projectId: project.id,
            requiredElements: formData.requiredElements,
            prizePool: formData.prizePool,
            fields: {
              create: formData.fields.map((field, index) => ({
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
        })
      }
    }

    return NextResponse.json({ success: true, project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the project data
    const validatedData = projectUpdateSchema.parse(data)

    // Update the project in the database
    const project = await prisma.project.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        organizationName: validatedData.organizationName,
        imageUrl: validatedData.imageUrl,
        description: validatedData.description,
        adminAddresses: validatedData.adminAddresses,
        validatorAddresses: validatedData.validatorAddresses,
        dataTypes: validatedData.dataTypes,
        contactEmail: validatedData.contactEmail,
      },
    })

    return NextResponse.json({ success: true, project }, { status: 200 })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 })
  }
}

