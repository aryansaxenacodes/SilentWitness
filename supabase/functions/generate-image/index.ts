import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ImageRequest {
  prompt: string;
}

Deno.serve(async (req: Request) => {
  console.log("Generate image endpoint called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const { prompt } = body as ImageRequest;

    console.log("Received prompt:", prompt);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    console.log("API Key exists:", !!apiKey);
    
    if (!apiKey) {
      console.error("API key not found in environment");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const enhancedPrompt = `Create a dark, surreal, psychological thriller artwork. Style: dreamlike painting with symbolic imagery, muted dark colors, abstract and haunting. Scene: ${prompt}. Artistic style: oil painting, dark expressionism, symbolist art. Avoid photorealism - focus on emotional and psychological elements.`;

    console.log("Calling Gemini API with enhanced prompt");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateImage?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
        }),
      }
    );

    console.log("Gemini response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate image", details: errorText }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    console.log("Gemini response data keys:", Object.keys(data));

    let imageBase64 = null;
    
    if (data.images && data.images.length > 0) {
      if (data.images[0].data) {
        imageBase64 = data.images[0].data;
      } else if (data.images[0].image) {
        imageBase64 = data.images[0].image;
      } else if (data.images[0].base64) {
        imageBase64 = data.images[0].base64;
      }
    }

    if (!imageBase64) {
      console.error("No image data found in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "No image data in response", response: data }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const base64Image = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/png;base64,${imageBase64}`;

    console.log("Successfully generated image, returning base64");

    return new Response(
      JSON.stringify({
        success: true,
        image: base64Image,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
