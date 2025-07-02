import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/lib/embedding";
import { cosineSimilarity } from "@/lib/similarity";
import { prisma } from "@/lib/prisma";

type NoteWithEmbedding = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  embedding: number[] | string; // handle vector format from Neon
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const queryEmbedding = await getEmbedding(query);

  const notes = await prisma.$queryRawUnsafe<NoteWithEmbedding[]>(`
    SELECT id, title, content, "userId", "createdAt", embedding
    FROM "Note"
  `);

  const scored = notes
    .filter((note) => note.embedding)
    .map((note) => {
      const embedding = typeof note.embedding === "string"
        ? JSON.parse(note.embedding)
        : note.embedding;

      return {
        ...note,
        score: cosineSimilarity(queryEmbedding, embedding),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return NextResponse.json(scored);
}
