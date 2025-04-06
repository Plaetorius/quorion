"use server";

import { PrismaClient } from "@prisma/client";
import { cache } from "react";

const prisma = new PrismaClient();

/**
 * Retrieves a project by its ID
 * Uses React cache to optimize repeated calls for the same project
 */
export const getProjectById = cache(async (id: string) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        forms: true,
        submissions: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
});
