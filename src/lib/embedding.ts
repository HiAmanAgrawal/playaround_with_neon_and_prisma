import { pipeline } from "@xenova/transformers";

interface FeatureExtractionModel {
    (text: string, options?: { pooling?: string; normalize?: boolean }): Promise<{ data: Float32Array }>;
}

let embedder: FeatureExtractionModel;

export async function getEmbedding(text: string): Promise<number[]> {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2") as FeatureExtractionModel; // Type assertion here after pipeline
        //console.log(embedder); //Inspect the embedder object
    }

    const output = await embedder(text, {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data);
}