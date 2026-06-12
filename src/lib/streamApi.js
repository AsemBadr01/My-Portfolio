// Streams the Oracle reply from /api/oracle (Vercel Edge → Groq).
// onToken(text) — append streamed text; onNavigate(n) — sentinel detected;
// onBusy(text) — rate-limited / offline friendly fallback; onDone() — stream finished.
export async function streamOracle(messages, { onToken, onNavigate, onBusy, onDone, signal }) {
  let res
  try {
    res = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal,
    })
  } catch (e) {
    if (e.name === 'AbortError') return
    onBusy("Hmm, I can't reach my brain right now — try again in a moment, or email asemmosa202@gmail.com 😄")
    return
  }

  if (res.status === 429) {
    const data = await res.json().catch(() => ({}))
    onBusy(data.fallback || "I'm getting a lot of questions right now — email Assem directly: asemmosa202@gmail.com 😄")
    return
  }
  if (!res.ok || !res.body) {
    onBusy('Something glitched on my end — try again in a moment, or email asemmosa202@gmail.com')
    return
  }

  const sentinel = createSentinelParser({ onNavigate, onText: onToken })
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop()
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (payload === '[DONE]') {
          sentinel.flush()
          onDone()
          return
        }
        try {
          const delta = JSON.parse(payload).choices?.[0]?.delta?.content
          if (delta) sentinel.feed(delta)
        } catch {
          /* keepalive or partial frame — ignore */
        }
      }
    }
  } catch (e) {
    if (e.name !== 'AbortError') onBusy('The stream dropped — mind trying that again?')
    return
  }
  sentinel.flush()
  onDone()
}

// Buffers the first few characters of the stream; if they form [[NAV:N]],
// fires onNavigate and strips it. Otherwise releases text untouched.
export function createSentinelParser({ onNavigate, onText }) {
  let buf = ''
  let resolved = false
  return {
    feed(token) {
      if (resolved) return onText(token)
      buf += token
      if (buf.length < 9 && '[[NAV:'.startsWith(buf.slice(0, 6))) return // still ambiguous
      const m = buf.match(/^\[\[NAV:([1-5])\]\]\s*/)
      if (m) {
        onNavigate?.(Number(m[1]))
        buf = buf.slice(m[0].length)
      }
      resolved = true
      if (buf) onText(buf)
      buf = ''
    },
    flush() {
      if (resolved || !buf) return
      const m = buf.match(/^\[\[NAV:([1-5])\]\]\s*/)
      if (m) {
        onNavigate?.(Number(m[1]))
        buf = buf.slice(m[0].length)
      }
      resolved = true
      if (buf) onText(buf)
      buf = ''
    },
  }
}
