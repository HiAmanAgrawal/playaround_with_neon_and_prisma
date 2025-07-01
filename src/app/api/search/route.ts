import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getEmbedding } from "@/lib/embedding";
import { cosineSimilarity } from "@/lib/similarity";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const queryEmbedding = await getEmbedding(query);
  const notes = await prisma.note.findMany();

  const scored = notes
    .filter((note) => note.embedding)
    .map((note) => ({
      ...note,
      score: cosineSimilarity(queryEmbedding, note.embedding as number[]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // top 5 similar notes

  return NextResponse.json(scored);
}
