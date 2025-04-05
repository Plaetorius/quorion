// app/api/upload/route.ts
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Récupère le formData depuis la requête
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response('Aucun fichier envoyé.', { status: 400 });
    }

    // Convertit le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Crée l'enregistrement dans la base de données
    const newImage = await prisma.image.create({
      data: {
        data: buffer,
        mime: file.type,
        name: file.name,
      },
    });

    return new Response(JSON.stringify(newImage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Erreur lors de l\'upload de l\'image.', {
      status: 500,
    });
  }
}
