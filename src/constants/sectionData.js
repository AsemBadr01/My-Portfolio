export const SECTIONS = [
  {
    n: 1,
    id: 'home',
    name: 'Home',
    accent: '#38bdf8',
    pills: ['Give me the 30-second pitch', 'Show me your best work'],
    narration:
      "Welcome! 👋 I'm Assem — an AI engineer from Cairo who teaches machines to listen. This portfolio is one continuous journey: six stations, left to right. Let's go.",
  },
  {
    n: 2,
    id: 'about',
    name: 'About',
    accent: '#a78bfa',
    pills: ['Summarize your background', 'What drives you?'],
    narration:
      'A quick intro: Computer & Information Science at Ain Shams University, 2020–2024, graduated Very Good. I fell in love with machine learning early — and never looked back. 🧠',
  },
  {
    n: 3,
    id: 'skills',
    name: 'Skills',
    accent: '#34d399',
    pills: ["What's your strongest skill?", "What's your full stack?"],
    narration:
      'My toolbox: Python and PyTorch at the core, Transformers and NLP for the brain, Azure and WebSockets to ship it live. I build end-to-end — from data to deployment. ⚙️',
  },
  {
    n: 4,
    id: 'projects',
    name: 'Projects',
    accent: '#d4a843',
    pills: ['What is Makhraj?', 'How did you cut WER from 119% to 27%?', 'Explain the matching algorithm'],
    narration:
      "This is the work I'm most proud of: Makhraj — مخرج. We fine-tuned OpenAI Whisper to hear Quranic recitation with full Tashkeel and flag mistakes in real time. WER dropped from 119% to 27%. Grade: A. 🕌✨",
  },
  {
    n: 5,
    id: 'experience',
    name: 'Experience',
    accent: '#fb7185',
    pills: ['Walk me through your journey', 'What did you study?'],
    narration:
      'The timeline: 2020 I enrolled, 2021 the math clicked, 2022 I went deep into Transformers, 2024 Makhraj went live on Azure — and 2026, GridNox.ai. 🚀',
  },
  {
    n: 6,
    id: 'contact',
    name: 'Contact',
    accent: '#38bdf8',
    pills: ["Let's work together 🎉", 'Contact Assem'],
    narration:
      "Final station. If you're building something interesting, I want to hear about it — email, LinkedIn, GitHub, all right here. Or just type 'let's work together'. 🎉",
  },
]

export const sectionName = (n) => SECTIONS[n - 1]?.name || ''

export const TOUR_OFFER =
  "Hey — I'm Echo, Assem's AI guide. I've listened to his whole story (occupational habit). Want the guided tour? I'll narrate each station as you scroll. 🎧"

export const CONTACT_REPLY =
  "Now we're talking! 🎉 Here's how to reach me:\n\n📧 asemmosa202@gmail.com\n💼 linkedin.com/in/assem-badr\n🐙 github.com/AsemBadr01\n📍 Cairo, Egypt — open to opportunities.\n\nThe next chapter has a seat with your name on it."

export const NAV_CONFIRMS = {
  1: 'Heading back to the start ✨',
  2: "Here's the story behind the engineer ✨",
  3: 'Opening the toolbox ✨',
  4: 'Taking you to Makhraj — my favorite work ✨',
  5: 'Rolling out the timeline ✨',
  6: "Let's talk — taking you to contact ✨",
}
