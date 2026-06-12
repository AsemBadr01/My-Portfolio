const NAV_TARGETS = [
  [/(beginnings?|start|2020|sketch|university|uni\b)/i, 1],
  [/(machine learning|\bml\b|2021|perceptron|adaline)/i, 2],
  [/(deep learning|matrix|pytorch|transformers?|attention|2022)/i, 3],
  [/(makhraj|quran|مخرج|القرآن|recit|2023)/i, 4],
  [/(azure|deploy|cloud|contact|hire|2024|end\b|final)/i, 5],
]

const NAV_VERBS = /(take me|go to|show me|navigate|skip|jump|move to|خذني|انتقل|اذهب|وديني)/i

export function detectNavIntent(text) {
  if (!NAV_VERBS.test(text)) return null
  for (const [re, n] of NAV_TARGETS) if (re.test(text)) return n
  return null
}

export const isHireIntent = (text) => /(hire me|let'?s work together|اشتغل معايا|وظفني)/i.test(text)

export const isBasmala = (text) => /بسم الله/.test(text)

export const isMatrixEgg = (text) => /^matrix$/i.test(text.trim())
