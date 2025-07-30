// Agent Elohim VPS Integration Service
// Connects to the external Mistral 4B Instruct model

export async function runAgentElohim(input: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch("http://178.16.143.5:3000/respond", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer fuPRVYCaxDpnlR03nUojV1umTfS3zjpLIaoSAuoY35e337a5"
      },
      body: JSON.stringify({ input }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`VPS error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output || data.response || "Agent Elohim processed your request successfully.";
  } catch (err) {
    console.error("Agent Elohim VPS connection failed, using local fallback:", err);
    
    // Use local fallback AI when VPS is unavailable
    return await runLocalAI(input);
  }
}

// Health check for the VPS connection
export async function checkAgentElohimHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced timeout
    
    const response = await fetch("http://178.16.143.5:3000/health", {
      method: "GET",
      headers: {
        "Authorization": "Bearer fuPRVYCaxDpnlR03nUojV1umTfS3zjpLIaoSAuoY35e337a5"
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (err) {
    console.error("Agent Elohim VPS health check failed:", err);
    return false;
  }
}

// Fallback local AI response for demo purposes
export async function runLocalAI(input: string): Promise<string> {
  // Simulate AI response with realistic delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const lowerInput = input.toLowerCase();
  
  // Provide contextual responses based on input
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Hello! I'm Agent Elohim, your comprehensive AI assistant. I'm running in demo mode while connecting to the VPS. I can help with business analysis, content creation, technical questions, and more. What would you like to explore?";
  }
  
  if (lowerInput.includes('elohim') || lowerInput.includes('agent')) {
    return "Agent Elohim is a comprehensive AI platform with multiple capabilities: Mistral 4B Instruct for conversations, Whisper for voice transcription, Coqui for speech synthesis, Stable Diffusion for images, and specialized business tools. The platform operates independently with VPS hosting for maximum performance and no external dependencies.";
  }
  
  if (lowerInput.includes('business') || lowerInput.includes('analytics')) {
    return "I can help with business analytics, KPI tracking, market analysis, competitive research, and strategic planning. The business module includes real-time dashboards, task management, and performance metrics. Would you like me to generate some sample business insights for your industry?";
  }
  
  if (lowerInput.includes('content') || lowerInput.includes('marketing')) {
    return "I excel at content creation across multiple formats: blog posts, social media content, email campaigns, product descriptions, and marketing copy. I can adapt tone, style, and messaging for different audiences and platforms. What type of content would you like me to create?";
  }
  
  if (lowerInput.includes('voice') || lowerInput.includes('speech')) {
    return "The voice system combines Whisper for speech-to-text transcription with Coqui TTS for natural speech synthesis. This enables full voice-to-voice conversations. While in demo mode, the voice features show simulated responses. Once the VPS connects, you'll have real-time voice AI conversations.";
  }
  
  if (lowerInput.includes('image') || lowerInput.includes('art') || lowerInput.includes('generate')) {
    return "I can generate images using Stable Diffusion with various styles: realistic, artistic, technical diagrams, logos, and more. The image generator supports detailed prompts and style modifications. What kind of image would you like me to create for you?";
  }
  
  // General intelligent response
  return `I understand you're inquiring about "${input}". As Agent Elohim, I'm designed to provide comprehensive assistance across technology, business, creative, and analytical domains. While operating in demo mode, I can help with strategic planning, content creation, technical analysis, and problem-solving. How can I best assist you with this topic?`;
}