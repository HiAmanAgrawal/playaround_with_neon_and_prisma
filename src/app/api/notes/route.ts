import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@prisma/client";
import { getEmbedding } from "@/lib/embedding";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(notes);
  }

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Not logged in" });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const { title, content } = await req.json();
  const embedding = await getEmbedding(`${title} ${content}`);

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: user!.id,
      embedding, // 🧠 save vector
    },
  });

  return NextResponse.json(note);
}
