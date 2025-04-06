import { PrismaClient } from '@prisma/client'
import { projects } from '../data/projects'
import { mockForms } from '../data/mock-forms'
import { mockSubmissions } from '../data/mock-submissions'

const prisma = new PrismaClient()

// Helper function to parse field value to the correct type
function parseFieldValue(value: any, fieldType: string) {
  if (value === null) return null;
  
  switch (fieldType) {
    case 'number':
      return { numberValue: Number(value) };
    case 'checkbox':
    case 'radio':
      if (Array.isArray(value)) {
        return { textValue: JSON.stringify(value) };
      }
      return { textValue: String(value) };
    case 'date':
      return { dateValue: new Date(value) };
    case 'file':
      return {}; // File handling is special
    default:
      return { textValue: String(value) };
  }
}

async function main() {
  console.log(`Start seeding...`)
  
  // Map to store original ID -> database ID mappings
  const projectMap = new Map<string, string>();
  const formMap = new Map<string, string>();
  
  // Seed projects
  console.log(`Seeding projects...`)
  for (const project of projects) {
    const createdProject = await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: {
        id: project.id,
        name: project.name,
        organizationName: project.organizationName,
        imageUrl: project.imageUrl,
        adminAddresses: project.adminAddresses,
        validatorAddresses: project.validatorAddresses,
        dataTypes: project.dataTypes,
        requiredElements: project.requiredElements,
        collectedElements: project.collectedElements,
        totalPrizePool: project.totalPrizePool,
        distributedPrizePool: project.distributedPrizePool,
        contactEmail: project.contactEmail,
        description: project.description || '',
      },
    })
    
    // Store the mapping
    projectMap.set(project.id, createdProject.id);
    console.log(`Created project: ${project.name} with ID: ${createdProject.id}`);
  }

  // Seed forms
  console.log(`Seeding forms...`)
  const formsToCreate = mockForms.filter(form => projectMap.has(form.projectId));
  
  if (mockForms.length !== formsToCreate.length) {
    console.warn(`Found ${mockForms.length - formsToCreate.length} forms with invalid project references. These will be skipped.`);
  }
  
  for (const form of formsToCreate) {
    // Get the actual project ID from our map - this should never be undefined now
    const projectId = projectMap.get(form.projectId)!;
    
    // Create the form first
    const createdForm = await prisma.form.upsert({
      where: { id: form.id },
      update: {
        projectId: projectId, // Make sure even on update the project ID is correct
      },
      create: {
        id: form.id,
        projectId: projectId, // Use the mapped project ID
        name: form.name,
        description: form.description || '',
      },
    })
    
    // Store the form mapping
    formMap.set(form.id, createdForm.id);
    console.log(`Created form: ${form.name} with ID: ${createdForm.id} for project: ${projectId}`);

    // Then create fields for the form
    for (const field of form.fields) {
      await prisma.formField.upsert({
        where: { id: field.id },
        update: {},
        create: {
          id: field.id,
          formId: createdForm.id, // Use the actual form ID
          label: field.label,
          type: field.type,
          required: field.required,
          order: field.order,
          options: field.options ? JSON.stringify(field.options) : null,
          fileTypes: field.fileTypes || [],
          maxFiles: field.maxFiles,
        },
      })
    }
  }

  // Seed form submissions
  console.log(`Seeding form submissions...`)
  const submissionsToCreate = mockSubmissions.filter(
    sub => projectMap.has(sub.projectId) && formMap.has(sub.formId)
  );
  
  if (mockSubmissions.length !== submissionsToCreate.length) {
    console.warn(`Found ${mockSubmissions.length - submissionsToCreate.length} submissions with invalid project or form references. These will be skipped.`);
  }
  
  for (const submission of submissionsToCreate) {
    // Get the actual project and form IDs from our maps - these should never be undefined now
    const projectId = projectMap.get(submission.projectId)!;
    const formId = formMap.get(submission.formId)!;
    
    // First create the form submission
    const createdSubmission = await prisma.formSubmission.upsert({
      where: { id: submission.id },
      update: {
        projectId: projectId, // Make sure even on update the project ID is correct
        formId: formId, // Make sure even on update the form ID is correct
      },
      create: {
        id: submission.id,
        formId: formId,
        projectId: projectId,
        submitterId: submission.submitterId,
        status: submission.status,
        notes: submission.notes || '',
      },
    })

    // Find the form to get field types
    const form = mockForms.find(f => f.id === submission.formId);
    if (!form) continue;

    // Create field responses for this submission
    for (const response of submission.responses) {
      const field = form.fields.find(f => f.id === response.fieldId);
      if (!field) continue;

      const fieldValues = parseFieldValue(response.value, field.type);
      
      // Create file entries if it's a file field
      const fileIds: string[] = [];
      if (field.type === 'file' && response.fileUrls && response.fileUrls.length > 0) {
        for (const fileUrl of response.fileUrls) {
          // Create a File record
          const file = await prisma.file.create({
            data: {
              name: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              url: fileUrl,
              size: 1000, // Mock size
              mimeType: field.fileTypes?.[0] || 'application/octet-stream',
              submitterId: submission.submitterId,
            }
          });
          fileIds.push(file.id);
        }
      }

      // Create the field response
      await prisma.fieldResponse.create({
        data: {
          submissionId: createdSubmission.id,
          fieldId: response.fieldId,
          ...fieldValues,
          fileIds: fileIds,
        },
      })
    }

    // Update the project's collectedElements count
    await prisma.project.update({
      where: { id: projectId },
      data: {
        collectedElements: {
          increment: 1
        }
      }
    });
    
    console.log(`Created submission with ID: ${createdSubmission.id} for form: ${formId} and project: ${projectId}`);
  }

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
