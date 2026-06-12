import { ECHO_SYSTEM_PROMPT } from '../src/constants/echoPrompt.js'

export const config = { runtime: 'edge' }

const PRIMARY = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const FALLBACK = process.env.GROQ_FALLBACK || 'llama-3.1-8b-instant'
const BUSY = "I'm getting a lot of questions right now — give me a minute, or email Assem directly: asemmosa202@gmail.com 😄"

function callGroq(model, messages) {
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      temperature: 0.6,
      stream: true,
      messages: [{ role: 'system', content: ECHO_SYSTEM_PROMPT }, ...messages.slice(-10)],
    }),
  })
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  // Cheap abuse guard: only browsers on this deployment (or local dev) may call.
  const origin = req.headers.get('origin') || ''
  if (origin) {
    let host = ''
    try {
      host = new URL(origin).host
    } catch {
      return new Response('Forbidden', { status: 403 })
    }
    const ok = host.endsWith('.vercel.app') || host.startsWith('localhost') || host.startsWith('127.0.0.1')
    if (!ok) return new Response('Forbidden', { status: 403 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }
  const { messages } = body || {}
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 24 ||
    messages.some((m) => typeof m?.content !== 'string' || m.content.length > 4000)
  ) {
    return new Response('Bad request', { status: 400 })
  }

  let upstream = await callGroq(PRIMARY, messages)
  if (upstream.status === 429) upstream = await callGroq(FALLBACK, messages)
  if (upstream.status === 429) {
    return new Response(JSON.stringify({ fallback: BUSY }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    })
  }
  if (!upstream.ok) return new Response('Upstream error', { status: 502 })

  return new Response(upstream.body, {
    headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
  })
}
