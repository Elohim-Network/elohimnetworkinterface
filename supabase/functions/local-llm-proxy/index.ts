
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers to allow requests from the Lovable.dev application
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const requestData = await req.json();
    console.log("Received request:", JSON.stringify(requestData));

    // Target Ollama server running locally
    const ollamaUrl = "http://127.0.0.1:11434/api/generate";

    // Forward the request to local Ollama
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    // Get the response from Ollama
    const ollamaResponse = await response.json();
    console.log("Received response from Ollama:", JSON.stringify(ollamaResponse));

    // Return the response with CORS headers
    return new Response(JSON.stringify(ollamaResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in local-llm-proxy:", error);
    
    // Return error with CORS headers
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
