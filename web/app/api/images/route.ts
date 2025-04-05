// app/api/images/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Récupère toutes les images de la DB
    const images = await prisma.image.findMany();

    // Convertit chaque image en chaîne base64 préfixée par le MIME
    const imagesData = images.map(image => ({
      id: image.id,
      name: image.name,
      mime: image.mime,
      // On reconstruit une URL data pour pouvoir l'afficher directement dans un <img />
      data: `data:${image.mime};base64,${Buffer.from(image.data).toString('base64')}`
    }));

    return new Response(JSON.stringify(imagesData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error saving images" }, { status: 500 })

  }
}
