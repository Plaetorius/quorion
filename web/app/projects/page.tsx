import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import { getProjects } from "./actions"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Data Projects</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse and contribute to cutting-edge health research initiatives powered by Web3 technology.
          </p>
        </div>
        <Button variant="default" size="lg" className="whitespace-nowrap" asChild>
          <Link href="/project/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found. Create your first project!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

