/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-toastify"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock, User, Calendar, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getProjectById } from "../actions"
import { getProjectSubmissions, getFormForSubmission, type FormSubmission } from "@/data/mock-submissions"

export default function ValidatorPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [validationNote, setValidationNote] = useState("")
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const [formDetails, setFormDetails] = useState<any>(null)
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  // Ref to track if component is mounted
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      const projectData = getProjectById(params.id as string)
      if (!projectData) {
        toast.error("Project not found")
        router.push("/projects")
        return
      }

      setProject(projectData)

      // Get pending submissions for this project
      const projectSubmissions = getProjectSubmissions(params.id as string)
      setSubmissions(projectSubmissions.filter((s) => s.status === "pending"))

      if (projectSubmissions.length > 0) {
        setSelectedSubmission(projectSubmissions[0])
        const form = getFormForSubmission(projectSubmissions[0])
        setFormDetails(form)
      }

      setIsLoading(false)
    }
  }, [params.id, router])

  const handleSelectSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setValidationNote("")
    const form = getFormForSubmission(submission)
    setFormDetails(form)
  }

  const handleApprove = async () => {
    if (!selectedSubmission) return

    setProcessingAction(true)

    try {
      // In a real app, this would call the API to encrypt and store the data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the submission status
      const updatedSubmissions = submissions.filter((s) => s.id !== selectedSubmission.id)
      setSubmissions(updatedSubmissions)

      // If there are more submissions, select the next one
      if (updatedSubmissions.length > 0) {
        setSelectedSubmission(updatedSubmissions[0])
        const form = getFormForSubmission(updatedSubmissions[0])
        setFormDetails(form)
      } else {
        setSelectedSubmission(null)
        setFormDetails(null)
      }

      toast.success("Submission approved and encrypted successfully")
    } catch (error) {
      console.error("Error approving submission:", error)
      toast.error("Error approving submission")
    } finally {
      setProcessingAction(false)
      setShowApproveDialog(false)
      setValidationNote("")
    }
  }

  const handleReject = async () => {
    if (!selectedSubmission) return

    setProcessingAction(true)

    try {
      // In a real app, this would call the API to delete the data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the submission status
      const updatedSubmissions = submissions.filter((s) => s.id !== selectedSubmission.id)
      setSubmissions(updatedSubmissions)

      // If there are more submissions, select the next one
      if (updatedSubmissions.length > 0) {
        setSelectedSubmission(updatedSubmissions[0])
        const form = getFormForSubmission(updatedSubmissions[0])
        setFormDetails(form)
      } else {
        setSelectedSubmission(null)
        setFormDetails(null)
      }

      toast.success("Submission rejected and deleted successfully")
    } catch (error) {
      console.error("Error rejecting submission:", error)
      toast.error("Error rejecting submission")
    } finally {
      setProcessingAction(false)
      setShowRejectDialog(false)
      setValidationNote("")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFieldLabel = (fieldId: string) => {
    if (!formDetails) return "Unknown Field"
    const field = formDetails.fields.find((f: any) => f.id === fieldId)
    return field ? field.label : "Unknown Field"
  }

  const getFieldType = (fieldId: string) => {
    if (!formDetails) return "text"
    const field = formDetails.fields.find((f: any) => f.id === fieldId)
    return field ? field.type : "text"
  }

  const handleViewImage = (url: string) => {
    setViewingImage(url)
  }

  const renderFieldValue = (response: any) => {
    const fieldType = getFieldType(response.fieldId)

    switch (fieldType) {
      case "checkbox":
        if (Array.isArray(response.value)) {
          return (
            <div className="space-y-1">
              {response.value.map((item: string, index: number) => (
                <Badge key={index} variant="outline" className="mr-1">
                  {item}
                </Badge>
              ))}
            </div>
          )
        }
        return String(response.value)

      case "file":
        if (response.fileUrls && response.fileUrls.length > 0) {
          return (
            <div className="space-y-2">
              {response.fileUrls.map((url: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="relative h-16 w-16 rounded overflow-hidden border">
                    <Image src={url || "/placeholder.svg"} alt={`File ${index + 1}`} fill className="object-cover" />
                  </div>
                  <Button size="sm" variant="outline" className="h-8" onClick={() => handleViewImage(url)}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          )
        }
        return "No files uploaded"

      default:
        return String(response.value)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <Link
        href={`/project/${params.id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Project
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Submissions List */}
        <div className="lg:w-1/3">
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Submissions</h2>

            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending submissions to validate</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${selectedSubmission?.id === submission.id ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handleSelectSubmission(submission)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{submission.submitterName}</h3>
                        <p className="text-xs text-muted-foreground truncate">{submission.submitterId}</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {formatDate(submission.submissionDate)}
                      </div>
                      <div className="flex items-center mt-1">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        {getFormForSubmission(submission)?.name || "Unknown Form"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="lg:w-2/3">
          {selectedSubmission ? (
            <div className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Submission Details</h2>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Validation
                </Badge>
              </div>

              <div className="mb-6 p-4 bg-muted/20 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitter</p>
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1.5 text-primary" />
                      <p className="font-medium">{selectedSubmission.submitterName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{selectedSubmission.submitterId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submission Date</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                      <p className="font-medium">{formatDate(selectedSubmission.submissionDate)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Form</p>
                  <div className="flex items-center mt-1">
                    <FileText className="h-4 w-4 mr-1.5 text-primary" />
                    <p className="font-medium">{formDetails?.name || "Unknown Form"}</p>
                  </div>
                  {formDetails?.description && (
                    <p className="text-sm text-muted-foreground mt-1">{formDetails.description}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Submission Data</h3>
                <div className="space-y-6">
                  {selectedSubmission.responses.map((response) => (
                    <div key={response.fieldId} className="border-b border-border pb-4">
                      <p className="font-medium mb-1">{getFieldLabel(response.fieldId)}</p>
                      <div className="text-muted-foreground">{renderFieldValue(response)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="validationNote" className="mb-2 block">
                  Validation Notes
                </Label>
                <Textarea
                  id="validationNote"
                  placeholder="Add notes about this submission (optional)"
                  rows={4}
                  value={validationNote}
                  onChange={(e) => setValidationNote(e.target.value)}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Submission</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reject this submission? This action will delete the data and cannot be
                        undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="font-medium">Rejection Notes:</p>
                      <p className="text-muted-foreground">{validationNote || "No notes provided"}</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={processingAction}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleReject} disabled={processingAction}>
                        {processingAction ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Confirm Rejection
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Submission</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to approve this submission? The data will be encrypted and stored
                        securely.
                      </DialogDescription>
                    </DialogHeader>
                    {validationNote && (
                      <div className="py-4">
                        <p className="font-medium">Validation Notes:</p>
                        <p className="text-muted-foreground">{validationNote}</p>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={processingAction}>
                        Cancel
                      </Button>
                      <Button variant="default" onClick={handleApprove} disabled={processingAction}>
                        {processingAction ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Approval
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Submission Selected</h3>
              <p className="text-muted-foreground">
                {submissions.length > 0
                  ? "Select a submission from the list to validate"
                  : "There are no pending submissions to validate"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] w-full">
            {viewingImage && (
              <Image src={viewingImage || "/placeholder.svg"} alt="File preview" fill className="object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

