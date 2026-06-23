// Text-to-speech for the Chinese game via the browser's built-in speechSynthesis.
// No audio files, no new dependencies — matches the no-asset philosophy of utils/sound.js.
// Falls back silently if the browser has no speech synthesis (or no Chinese voice).
//
// Note: speechSynthesis needs a user gesture, so speak() is only ever called from a
// tap handler. voices load asynchronously, so we cache a Chinese voice and refresh it
// when the `voiceschanged` event fires.

let zhVoice = null

function supportsSpeech() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice() {
  if (!supportsSpeech()) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  // Prefer Taiwan Mandarin (matches the Traditional-Chinese content), then any zh voice.
  return (
    voices.find((v) => /zh[-_]TW/i.test(v.lang)) ||
    voices.find((v) => /^zh/i.test(v.lang)) ||
    null
  )
}

if (supportsSpeech()) {
  zhVoice = pickVoice()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    zhVoice = pickVoice()
  })
}

/**
 * Speak `text` in Mandarin Chinese. Safe no-op if speech synthesis is unavailable.
 * Cancels any in-flight speech so rapid taps don't pile up.
 */
export function speak(text) {
  if (!supportsSpeech()) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-TW'
  const v = zhVoice || pickVoice()
  if (v) u.voice = v
  u.rate = 0.9 // slightly slower — friendlier for young learners
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
