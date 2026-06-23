// Math helpers for the kindergarten game.
// All subtraction results stay non-negative (a >= b) so they're age-appropriate.

export const RANGES = {
  easy: { min: 1, max: 5, label: '1 – 5' },
  medium: { min: 1, max: 10, label: '1 – 10' },
  hard: { min: 1, max: 20, label: '1 – 20' },
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Build one problem based on the chosen config.
 * config: { operation: 'add' | 'subtract' | 'mixed', difficulty: 'easy'|'medium'|'hard' }
 * returns: { a, b, op: 'add'|'subtract', answer }
 */
export function generateProblem(config) {
  const { min, max } = RANGES[config.difficulty]
  let op = config.operation
  if (op === 'mixed') op = Math.random() < 0.5 ? 'add' : 'subtract'

  if (op === 'add') {
    const a = randInt(min, max)
    const b = randInt(min, max)
    return { a, b, op, answer: a + b }
  }

  // subtraction — keep a >= b so the result is never negative
  let a = randInt(min, max)
  let b = randInt(min, max)
  if (b > a) [a, b] = [b, a]
  return { a, b, op, answer: a - b }
}

/**
 * Build a multiple-choice set: the correct answer plus 3 plausible,
 * non-negative distractors near the answer, then shuffled.
 */
export function buildChoices(answer) {
  const choices = new Set([answer])
  let guard = 0
  while (choices.size < 4 && guard < 50) {
    guard++
    const delta = randInt(1, 3)
    const sign = Math.random() < 0.5 ? -1 : 1
    const candidate = answer + sign * delta
    if (candidate >= 0) choices.add(candidate)
  }
  // Fallback fill in case the answer is very small.
  let extra = answer + 1
  while (choices.size < 4) {
    if (!choices.has(extra) && extra >= 0) choices.add(extra)
    extra++
  }
  return shuffle([...choices])
}
