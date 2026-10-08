export const DICTATION_SENTENCES = [
  {
    text: 'I like the red and black plane.',
    keywords: ['red', 'black', 'plane'],
  },
  {
    text: 'The trains are yellow and green.',
    keywords: ['trains', 'yellow', 'green'],
  },
  {
    text: 'It is orange and purple.',
    keywords: ['orange', 'purple'],
  },
  {
    text: 'I have two robots.',
    keywords: ['two', 'robots'],
  },
  {
    text: 'I have a gun and a doll.',
    keywords: ['gun', 'doll'],
  },
  {
    text: 'They are pink and white.',
    keywords: ['pink', 'white'],
  },
]

export function normalizeDictationText(value) {
  return String(value)
    .toLowerCase()
    .replace(/[.,!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function shuffleSentences(sentences) {
  const shuffled = [...sentences]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
