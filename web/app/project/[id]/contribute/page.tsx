/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import FormRenderer from "@/components/form-renderer"
import { getProjectById } from "@/data/projects"
import { mockForms } from "@/data/mock-forms"

export default function ContributePage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [forms, setForms] = useState<any[]>([])
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      const projectData = getProjectById(params.id as string)
      if (!projectData) {
        toast.error("Project not found")
        router.push("/projects")
        return
      }

      setProject(projectData)

      // In a real app, you would fetch forms from the API
      // For now, we'll use mock data
      const projectForms = mockForms.filter((form) => form.projectId === params.id)
      setForms(projectForms)

      setIsLoading(false)
    }
  }, [params.id, router])

  const handleFormSubmit = async (data: any) => {
    // In a real app, this would send the data to an API
    console.log("Form submission data:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Reset form selection after successful submission
    setSelectedFormId(null)

    // Redirect back to project page
    router.push(`/project/${params.id}`)
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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Contribute Data</h1>
        <p className="text-muted-foreground mb-8">
          {project.name} - Submit your health data to contribute to this research project.
        </p>

        {selectedFormId ? (
          <>
            <Button variant="outline" className="mb-6" onClick={() => setSelectedFormId(null)}>
              Choose a different form
            </Button>

            <FormRenderer form={forms.find((form) => form.id === selectedFormId)} onSubmitAction={handleFormSubmit} />
          </>
        ) : (
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Select Data Type to Contribute</h2>

              {forms.length === 0 ? (
                <p className="text-muted-foreground">No data collection forms available for this project.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all"
                      onClick={() => setSelectedFormId(form.id)}
                    >
                      <h3 className="font-medium mb-1">{form.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {form.description || "No description provided."}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">About Data Contribution</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Your data will be securely stored on our network using advanced encryption. Smart
                  contracts ensure that your data access is controlled and transparent.
                </p>
                <p>
                  You will receive compensation for your data contribution based on the project&apos;s reward structure.
                  Payments are processed securely and transparently on the blockchain.
                </p>
                <p>
                  All data is anonymized and verified before being added to the marketplace. Your privacy and security
                  are our top priorities.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

