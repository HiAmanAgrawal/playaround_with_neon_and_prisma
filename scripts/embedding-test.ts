import { pipeline } from "@xenova/transformers";

async function main() {
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const output = await embedder("buy milk and eggs", { pooling: "mean", normalize: true });
  console.log("Vector:", output.data.slice(0, 5)); // print first 5 values
}

main();
