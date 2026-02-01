const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral";

/**
 * Call Ollama LLM with a prompt
 * Returns the generated response text
 */
export async function callOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || "";
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to call Ollama: ${error.message}`);
    }
    throw new Error("Failed to call Ollama: Unknown error");
  }
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL.replace("/api/generate", "")}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}
