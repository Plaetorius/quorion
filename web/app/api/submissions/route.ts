import { type NextRequest, NextResponse } from "next/server"
import { formSubmissionSchema } from "@/domains/schema"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the submission data
    const validatedData = formSubmissionSchema.parse(data)

    // Create the submission in the database
    const submission = await prisma.formSubmission.create({
      data: {
        formId: validatedData.formId,
        projectId: validatedData.projectId,
        submitterId: validatedData.submitterId,
        status: "pending",
        responses: {
          create: validatedData.responses.map((response) => ({
            fieldId: response.fieldId,
            textValue: response.textValue,
            numberValue: response.numberValue,
            booleanValue: response.booleanValue,
            dateValue: response.dateValue,
            fileIds: response.fileUrls || [],
          })),
        },
      },
      include: {
        responses: true,
      },
    })

    // Update project collected elements count
    await prisma.project.update({
      where: { id: validatedData.projectId },
      data: {
        collectedElements: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true, submission }, { status: 201 })
  } catch (error) {
    console.error("Error creating submission:", error)
    return NextResponse.json({ success: false, error: "Failed to create submission" }, { status: 500 })
  }
}

