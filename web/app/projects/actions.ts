'use server'

import { Project } from '@/domains/types'
import { prisma } from '@/lib/prisma'

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany()
    
    return projects
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    throw new Error("Failed to fetch projects")
  }
}
