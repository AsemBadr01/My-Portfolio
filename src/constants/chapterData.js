export const CHAPTERS = [
  {
    n: 1,
    name: 'Beginnings',
    accent: '#2C2C2C',
    label: 'AB ·',
    pills: ['When did you start uni?', 'What was your first project?'],
    narration:
      "Chapter one. 2020. I was just a freshman stepping into Ain Shams University — nervous, curious, and absolutely obsessed with computers. This is where it all began. 🎒",
  },
  {
    n: 2,
    name: 'Learning',
    accent: '#3B82F6',
    label: 'f(AB) =',
    pills: ["What's the difference between Perceptron and Adaline?", 'When did you discover ML?'],
    narration:
      "Chapter two. I discovered machine learning and nothing was the same. Suddenly, math wasn't just numbers — it was intelligence. I built my first classifier, compared gradient-based vs threshold-based learning, and watched a machine learn. I was hooked. 📐",
  },
  {
    n: 3,
    name: 'Descent',
    accent: '#39FF14',
    label: 'AB@oracle:~$',
    pills: ['Explain Transformers in simple terms', "What's self-attention?"],
    narration:
      "2022. I fell into deep learning — and I mean DEEP. PyTorch. Transformers. Self-attention mechanisms. This is where I stopped learning about AI and started thinking like an AI engineer. 🟢",
  },
  {
    n: 4,
    name: 'Makhraj',
    accent: '#C9A84C',
    label: 'مخرج · AB',
    pills: ['What is Makhraj?', 'How did you reduce WER from 119% to 27%?', 'Explain the matching algorithm'],
    narration:
      "This chapter is personal. Makhraj — meaning 'articulation point' in Arabic — was my graduation project. We fine-tuned OpenAI Whisper to understand Quranic recitation with full Tashkeel, and built a matching algorithm from scratch that handles diacritic errors and mid-recitation correction. WER went from 119% to 27%. Grade: A. This is the work I'm most proud of. 🕌✨",
  },
  {
    n: 5,
    name: 'Deployed',
    accent: '#0078D4',
    label: 'Assem Badr — AI Engineer',
    pills: ["What's your full tech stack?", "Let's work together 🎉", 'Contact Assem'],
    narration:
      "Final chapter. The models were trained, the system went live on Azure, real-time WebSockets running. And chapter six is already written — GridNox.ai. But I'm always open to interesting opportunities. Want to build something together? 🚀",
  },
]

export const chapterName = (n) => CHAPTERS[n - 1]?.name || ''

export const TOUR_OFFER =
  "Hi! I'm the Oracle — I know everything about Assem's journey. Want me to walk you through? I'll narrate each chapter as you scroll. 👋"

export const CONTACT_REPLY =
  "Now we're talking! 🎉 Here's how to reach me:\n\n📧 asemmosa202@gmail.com\n💼 linkedin.com/in/assem-badr\n🐙 github.com/AsemBadr01\n📍 Cairo, Egypt — open to opportunities.\n\nChapter 6 has a seat with your name on it."

export const NAV_CONFIRMS = {
  1: 'Sure — taking you back to where it all began ✨',
  2: 'On our way to the machine learning days ✨',
  3: 'Descending into deep learning ✨',
  4: 'Taking you to Makhraj — my favorite chapter ✨',
  5: 'Heading to the final chapter ✨',
}
