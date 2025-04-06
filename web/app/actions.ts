'use server'

import { Project } from "@/domains/types"
import { prisma } from "@/lib/prisma"

/**
 * Fetches the latest 3 projects from the database to display as featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const featuredProjects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      select: {
        id: true,
        name: true,
        organizationName: true,
        imageUrl: true,
        adminAddresses: true,
        validatorAddresses: true,
        dataTypes: true,
        requiredElements: true,
        collectedElements: true,
        totalPrizePool: true,
        distributedPrizePool: true,
        contactEmail: true,
        description: true
      }
    })
    
    return featuredProjects
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}
