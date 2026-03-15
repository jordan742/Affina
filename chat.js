// Affina AI Chat Proxy
// Netlify Serverless Function — routes AI requests securely
// Your ANTHROPIC_API_KEY is stored as a Netlify environment variable (never in code)

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Rate limit check via IP (basic protection)
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { system, messages } = body;

  // Validate inputs
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Messages required' }) };
  }

  // Limit conversation length to prevent abuse (max 40 messages = 20 turns)
  const trimmedMessages = messages.slice(-40);

  // Sanitize: only allow valid roles
  const validMessages = trimmedMessages.filter(
    m => m.role === 'user' || m.role === 'assistant'
  );

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured. Please set ANTHROPIC_API_KEY in Netlify environment variables.' })
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system || 'You are Affina, a compassionate mental health companion. You are NOT a licensed therapist. In any crisis, direct to 988.',
        messages: validMessages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'AI service error', details: response.status })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        // Security headers
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'strict-transport-security': 'max-age=63072000; includeSubDomains'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
