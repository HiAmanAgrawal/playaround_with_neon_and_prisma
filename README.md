# 🧠 Semantic Notes App with Next.js + Prisma + Neon + HuggingFace

This is a full-stack AI-powered Notes app that supports semantic search using Hugging Face embeddings and pgvector (via Neon database). Users can log in via GitHub, write notes, and find similar notes using vector similarity.

---

## 🔧 Tech Stack

- **Next.js App Router (v15+)**
- **TypeScript**
- **Prisma ORM**
- **Neon PostgreSQL** with `pgvector` extension
- **NextAuth.js** with GitHub OAuth
- **Hugging Face Transformers** (text embedding)
- **Vector Search** using `cosine similarity`

---

## ⚙️ Local Development Setup

### 1. **Clone the Repo**

```bash
git clone <this-repo-url>
cd playaround_with_neon_and_prisma
````

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Set up Environment Variables**

Create a `.env` file in the root:

```env
DATABASE_URL=your_neon_postgres_url
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
AUTH_SECRET=some_random_secret
HUGGINGFACE_API_KEY=your_huggingface_token
```

> Use [Neon](https://neon.tech), [GitHub OAuth App](https://github.com/settings/developers), and [Hugging Face](https://huggingface.co/settings/tokens) to get the above keys.

---

## 🧠 Enable `pgvector` in Neon

1. Go to Neon project → click on your DB branch → click on **SQL Editor**
2. Run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 🛠️ Prisma Setup

### 1. Generate client

```bash
npx prisma generate
```

### 2. Create migrations and apply them

```bash
npx prisma migrate dev --name init
```

If you face schema mismatch issues:

```bash
npx prisma migrate reset
```

> All data will be lost; this is safe during dev.

---

## 🧪 Test the Hugging Face Embedding (Optional)

```bash
npx tsx scripts/embedding-test.ts
```

---

## 🚀 Run the Dev Server

```bash
npm run dev
```

Open `http://localhost:3000`

---

## 🧠 Semantic Search

### How it works

* When a user writes a note, we generate a vector embedding using Hugging Face
* That vector is stored in Neon DB (`pgvector`)
* Search queries also get embedded and matched using **cosine similarity**
* Top 5 similar notes are returned

---

## 📁 Project Structure

```
/src
  /app
    /api
      /auth/[...nextauth]  → Auth routes (NextAuth)
      /notes               → Create and fetch notes
      /search              → Semantic search endpoint
  /lib
    prisma.ts             → Prisma client
    auth-options.ts       → NextAuth config
    embedding.ts          → Hugging Face embedding fetcher
    similarity.ts         → Cosine similarity logic
```

---

## 🧠 Example `.prisma` schema (pgvector support)

```prisma
model Note {
  id        String   @id @default(dbgenerated("gen_random_uuid()"))
  title     String
  content   String
  embedding Unsupported("vector")?
  userId    String?
  createdAt DateTime?  @default(now())
  user      User?      @relation(fields: [userId], references: [id])
}
```

---

## 🧠 Example Query Logic

```ts
const notes = await prisma.$queryRawUnsafe(`
  SELECT id, title, content, "userId", "createdAt", embedding
  FROM "Note"
`);

const scored = notes
  .map(note => ({
    ...note,
    score: cosineSimilarity(queryEmbedding, note.embedding)
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
```

---

## ✅ Features Complete

* [x] GitHub OAuth Login
* [x] Create Notes
* [x] Generate Embeddings
* [x] Store embeddings in Neon `pgvector`
* [x] Semantic search by similarity
* [x] TypeScript-safe Prisma calls using `$queryRawUnsafe`

---

## 🧼 TODOs & Ideas

* [ ] Frontend UI for searching
* [ ] Embed visualization (t-SNE / PCA)
* [ ] Multi-user note sharing
* [ ] Deploy to Vercel

---

## 🧠 Powered By

* [Neon](https://neon.tech)
* [Next.js](https://nextjs.org/)
* [Prisma](https://www.prisma.io/)
* [Hugging Face](https://huggingface.co/)
* [NextAuth.js](https://next-auth.js.org/)
* [pgvector](https://github.com/pgvector/pgvector)

---

## 💬 Questions?

Ping me at `amanagrawal@thoughtworks.com` or raise an issue.

