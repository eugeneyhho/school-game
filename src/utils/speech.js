// Text-to-speech for the Chinese game via the browser's built-in speechSynthesis.
// Reads the Traditional-Chinese characters in Cantonese (廣東話). No audio files, no new
// dependencies — matches the no-asset philosophy of utils/sound.js.
//
// IMPORTANT limitation: speechSynthesis can only use voices INSTALLED ON THE DEVICE.
// Many phones ship with a Mandarin (zh-CN) voice and NO Cantonese voice. When that
// happens we fall back to the Mandarin voice — so the same characters come out in
// Mandarin, not 廣東話. To get real Cantonese, install a Cantonese (zh-HK / yue) voice
// on the device (iOS: Settings → Accessibility → Spoken Content → Voices → Chinese
// (Hong Kong)). The only way to guarantee Cantonese on every device is to bundle audio
// files instead — see doc/chinese-game.md.
//
// speechSynthesis needs a user gesture, so speak() is only ever called from a tap
// handler. Voices load asynchronously, so we cache one and refresh on `voiceschanged`.

let voice = null

function supportsSpeech() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** A voice that reads Cantonese (zh-HK or the `yue` macrolanguage, or a known name). */
function isCantonese(v) {
  return (
    /yue/i.test(v.lang) ||
    /zh[-_]HK/i.test(v.lang) ||
    /cantonese|粵語?|sin-?ji/i.test(v.name || '')
  )
}

function pickVoice() {
  if (!supportsSpeech()) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  // Prefer a Cantonese voice; fall back to any zh voice (usually Mandarin) rather than
  // silence — see the limitation note above.
  return voices.find(isCantonese) || voices.find((v) => /^zh/i.test(v.lang)) || null
}

if (supportsSpeech()) {
  voice = pickVoice()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    voice = pickVoice()
  })
}

/** True if the device has a Cantonese voice available (for UI hints / debugging). */
export function hasCantoneseVoice() {
  const v = pickVoice()
  return !!v && isCantonese(v)
}

/**
 * Speak `text` in Cantonese (廣東話) if a Cantonese voice is installed, else the device's
 * Chinese voice (usually Mandarin). Safe no-op if speech synthesis is unavailable.
 * Cancels any in-flight speech so rapid taps don't pile up.
 */
export function speak(text) {
  if (!supportsSpeech()) return
  const u = new SpeechSynthesisUtterance(text)
  const v = voice || pickVoice()
  if (v) {
    u.voice = v // assign the specific voice explicitly (strongest signal to the engine)
    u.lang = v.lang
  } else {
    u.lang = 'zh-HK'
  }
  u.volume = 1 // maximum — speechSynthesis caps volume at 1.0
  u.rate = 0.75 // slow, clear pacing for young learners
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
