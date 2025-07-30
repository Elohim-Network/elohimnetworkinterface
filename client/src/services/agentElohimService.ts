// Agent Elohim VPS Integration Service
// Connects to the external Mistral 4B Instruct model

export async function runAgentElohim(input: string): Promise<string> {
  try {
    const response = await fetch("http://178.16.143.5:3000/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output;
  } catch (err) {
    console.error("Agent Elohim VPS error:", err);
    return "Sorry, I couldn't connect to the core agent. Please check the VPS connection.";
  }
}

// Health check for the VPS connection
export async function checkAgentElohimHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch("http://178.16.143.5:3000/health", {
      method: "GET",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (err) {
    console.error("Agent Elohim VPS health check failed:", err);
    return false;
  }
}