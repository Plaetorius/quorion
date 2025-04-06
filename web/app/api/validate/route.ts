import { type NextRequest, NextResponse } from "next/server"
import { validationNoteSchema } from "@/domains/schema"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the validation data
    const validatedData = validationNoteSchema.parse(data)

    // Get the submission
    const submission = await prisma.formSubmission.findUnique({
      where: { id: validatedData.submissionId },
      include: { form: true, project: true },
    })

    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 })
    }

    if (validatedData.status === "approved") {
      // Update submission status
      await prisma.formSubmission.update({
        where: { id: validatedData.submissionId },
        data: {
          status: "approved",
          notes: validatedData.note,
        },
      })

      // Update project distributed prize pool
      const prizePerSubmission = submission.form.prizePool / submission.form.requiredElements

      await prisma.project.update({
        where: { id: submission.projectId },
        data: {
          distributedPrizePool: {
            increment: prizePerSubmission,
          },
        },
      })

      return NextResponse.json(
        {
          success: true,
          message: "Submission approved",
          prizeAwarded: prizePerSubmission,
        },
        { status: 200 },
      )
    } else {
      // Update submission status to rejected
      await prisma.formSubmission.update({
        where: { id: validatedData.submissionId },
        data: {
          status: "rejected",
          notes: validatedData.note,
        },
      })

      // Decrement collected elements count
      await prisma.project.update({
        where: { id: submission.projectId },
        data: {
          collectedElements: {
            decrement: 1,
          },
        },
      })

      return NextResponse.json(
        {
          success: true,
          message: "Submission rejected",
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error validating submission:", error)
    return NextResponse.json({ success: false, error: "Failed to validate submission" }, { status: 500 })
  }
}

