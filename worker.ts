/**
 * Cloudflare Worker that proxies requests to the Replicate API.
 * This avoids CORS issues since the worker makes server-side requests.
 */

export interface Env {
  // Assets binding for static files
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const REPLICATE_API_BASE = 'https://api.replicate.com';

// CORS headers to allow the frontend to call this worker
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleApiProxy(request: Request, path: string): Promise<Response> {
  // Get the Authorization header from the original request
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const targetUrl = `${REPLICATE_API_BASE}${path}`;

  // Forward the request to Replicate
  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: request.method !== 'GET' ? await request.text() : undefined,
  });

  try {
    const response = await fetch(proxyRequest);
    
    // Return the response with CORS headers
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Proxy request failed' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Proxy API requests to Replicate
    if (path.startsWith('/api/replicate/')) {
      const replicatePath = path.replace('/api/replicate', '');
      return handleApiProxy(request, replicatePath);
    }

    // Serve static assets for all other requests
    return env.ASSETS.fetch(request);
  },
};
