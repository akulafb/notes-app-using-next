import { ChromaClient } from "chromadb";

// Initialize ChromaDB client
// For local development, ChromaDB needs to be running as a server
// Default: http://localhost:8000 (Chroma's default port)
// To run Chroma locally: `chroma run --path ./chroma_db`
let chromaClient: ChromaClient | null = null;

function getChromaClient(): ChromaClient {
  if (!chromaClient) {
    // Parse CHROMA_URL if provided, otherwise use defaults
    const chromaUrl = process.env.CHROMA_URL || "http://localhost:8001";
    const url = new URL(chromaUrl);
    
    chromaClient = new ChromaClient({
      host: url.hostname,
      port: parseInt(url.port) || 8001,
      ...(url.protocol === "https:" && { ssl: true }),
    });
  }
  return chromaClient;
}

// We provide embeddings manually, so don't use a default embedding function.
const embeddingFunction = null;

/**
 * Check if ChromaDB server is available
 */
export async function checkChromaAvailable(): Promise<boolean> {
  try {
    const client = getChromaClient();
    await client.heartbeat();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get or create a user-scoped collection for notes
 * Each user has their own collection: notes_user_{userId}
 * Handles embedding function errors by recreating collections
 */
export async function getUserCollection(userId: string) {
  const collectionName = `notes_user_${userId}`;
  const client = getChromaClient();

  try {
    // Try to get existing collection
    return await client.getCollection({
      name: collectionName,
      embeddingFunction,
    });
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    
    // If error is about embedding function, we need to delete and recreate
    if (
      errorMsg.includes("DefaultEmbeddingFunction") ||
      errorMsg.includes("default-embed") ||
      errorMsg.includes("embedding function")
    ) {
      console.warn(
        `Collection ${collectionName} has embedding function issue, recreating...`
      );
      try {
        await client.deleteCollection({ name: collectionName });
      } catch (deleteError) {
        // Ignore delete errors
      }
    }
    
    // Collection doesn't exist or was deleted, create it
    try {
      return await client.createCollection({
        name: collectionName,
        metadata: { userId },
        embeddingFunction,
      });
    } catch (createError: any) {
      const createErrorMsg = createError.message || String(createError);
      
      // If collection was created between operations, try getting it again
      if (
        createErrorMsg.includes("already exists") ||
        createErrorMsg.includes("duplicate")
      ) {
        // Wait a moment and try again
        await new Promise((resolve) => setTimeout(resolve, 100));
        try {
          return await client.getCollection({
            name: collectionName,
            embeddingFunction,
          });
        } catch (finalError) {
          // If still failing with embedding function error, delete and recreate
          const finalErrorMsg = finalError.message || String(finalError);
          if (
            finalErrorMsg.includes("DefaultEmbeddingFunction") ||
            finalErrorMsg.includes("default-embed")
          ) {
            await client.deleteCollection({ name: collectionName });
            return await client.createCollection({
              name: collectionName,
              metadata: { userId },
              embeddingFunction,
            });
          }
          throw finalError;
        }
      }
      throw createError;
    }
  }
}

/**
 * Delete a user's collection (e.g., when user is deleted)
 */
export async function deleteUserCollection(userId: string) {
  const collectionName = `notes_user_${userId}`;
  try {
    const client = getChromaClient();
    await client.deleteCollection({ name: collectionName });
  } catch (error) {
    // Collection might not exist, ignore error
    console.error(`Error deleting collection ${collectionName}:`, error);
  }
}
