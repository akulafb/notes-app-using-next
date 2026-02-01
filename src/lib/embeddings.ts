import { pipeline, Pipeline } from "@xenova/transformers";

let embeddingPipeline: Pipeline | null = null;

/**
 * Load the embedding model (cached after first load)
 * Uses all-MiniLM-L6-v2 (same as Python sentence-transformers)
 */
async function loadEmbeddingModel() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return embeddingPipeline;
}

/**
 * Generate embedding vector for a text string
 * Returns a normalized embedding array
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await loadEmbeddingModel();
  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  // Convert tensor to array
  const embedding = Array.from(output.data);
  return embedding;
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const model = await loadEmbeddingModel();
  const embeddings: number[][] = [];

  for (const text of texts) {
    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });
    embeddings.push(Array.from(output.data));
  }

  return embeddings;
}
