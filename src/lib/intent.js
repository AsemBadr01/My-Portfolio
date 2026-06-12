// Order matters: more specific targets first so "work experience" → 5 while "your work" → 4,
// and "about your skills" → 3 before the generic "about" → 2.
const NAV_TARGETS = [
  [/(experience|journey|timeline|education|university|career|تجربة|الخبرة)/i, 5],
  [/(projects?|makhraj|quran|مخرج|القرآن|recit|portfolio|work)/i, 4],
  [/(skills?|stack|tech|tools?|toolbox|مهارات)/i, 3],
  [/(contact|hire|email|reach|talk|touch|تواصل)/i, 6],
  [/(about|who (is|are)|bio|background|story|عن)/i, 2],
  [/(home|hero|start|top|beginning|landing|البداية)/i, 1],
]

const NAV_VERBS = /(take me|go (to|back)|show me|navigate|skip|jump|move to|scroll to|خذني|انتقل|اذهب|وديني)/i

export function detectNavIntent(text) {
  if (!NAV_VERBS.test(text)) return null
  for (const [re, n] of NAV_TARGETS) if (re.test(text)) return n
  return null
}

export const isHireIntent = (text) => /(hire me|let'?s work together|اشتغل معايا|وظفني)/i.test(text)

export const isBasmala = (text) => /بسم الله/.test(text)
