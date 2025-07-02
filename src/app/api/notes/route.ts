// src/app/api/notes/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth-options";
import { prisma } from '@/lib/prisma';
import { getEmbedding } from '@/lib/embedding';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// ⬇️ GET: Fetch all notes
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

// ⬇️ POST: Create a note with vector embedding
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await req.json();
  const embedding = await getEmbedding(`${title} ${content}`);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.$executeRawUnsafe(
    `INSERT INTO "Note" (id, title, content, "userId", embedding, "createdAt")
     VALUES ($1, $2, $3, $4, $5::vector, NOW())`,
    uuidv4(),
    title,
    content,
    user.id,
    embedding
  );

  return NextResponse.json({ success: true });
}

