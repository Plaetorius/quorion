import Link from "next/link"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, FileText, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/data/projects"

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const progressPercentage = Math.round((project.collectedElements / project.requiredElements) * 100)
  const distributedPercentage = Math.round((project.distributedPrizePool / project.totalPrizePool) * 100)

  // Calculate if project is new (for demo purposes)
  const isNew = project.id.includes("0000") || project.id.includes("0001")

  return (
    <div
      className={cn(
        "w-full glass-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]",
        featured && "md:col-span-2 lg:col-span-1",
      )}
    >
      {/* Status indicator */}
      {isNew && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">New</span>
        </div>
      )}

      <div className="relative h-48 sm:h-56 w-full">
        <Image
          src={project.imageUrl || "/placeholder.svg?height=400&width=600"}
          alt={project.name}
          fill
          className="object-cover"
          unoptimized={project.imageUrl?.startsWith("http")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold truncate">{project.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{project.organizationName}</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Project metadata */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">
              {project.adminAddresses.length + project.validatorAddresses.length} Contributors
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.dataTypes.map((type) => (
              <span key={type} className="data-badge">
                {type === "Photos" && <FileText className="h-3 w-3" />}
                {type === "Videos" && <FileText className="h-3 w-3" />}
                {type === "Audios" && <FileText className="h-3 w-3" />}
                {type === "Forms" && <FileText className="h-3 w-3" />}
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Project description - only show on featured cards */}
        {featured && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || "No description provided."}
          </p>
        )}

        {/* Progress indicators */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                Data Collection
              </span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{project.collectedElements.toLocaleString()} collected</span>
              <span>{project.requiredElements.toLocaleString()} required</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prize Distribution</span>
              <span className="font-medium">{distributedPercentage}%</span>
            </div>
            <Progress value={distributedPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${project.distributedPrizePool.toLocaleString()} distributed</span>
              <span>${project.totalPrizePool.toLocaleString()} total</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <Link href={`/project/${project.id}`} className="block mt-2">
          <Button className="w-full group" variant="default">
            View Project
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

