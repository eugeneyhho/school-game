// Text-to-speech via the browser's built-in speechSynthesis. No audio files, no new
// dependencies — matches the no-asset philosophy of utils/sound.js.
//
// Used by the Chinese game (Cantonese, 廣東話) and the English game (English). speak()
// takes a BCP-47 lang tag and picks the best matching installed voice.
//
// IMPORTANT limitation: speechSynthesis can only use voices INSTALLED ON THE DEVICE.
// English voices are near-universal, so the English game works everywhere. Cantonese
// (zh-HK / yue) voices are NOT preinstalled on many phones — when absent we fall back to
// any zh voice (usually Mandarin), so the same characters come out in Mandarin. To get
// real 廣東話, install a Cantonese voice (iOS: Settings → Accessibility → Spoken Content
// → Voices → Chinese (Hong Kong)). The only way to GUARANTEE Cantonese on every device is
// to bundle recorded audio per word — see doc/chinese-game.md.
//
// speechSynthesis needs a user gesture, so speak() is only ever called from a tap handler.

function supportsSpeech() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function getVoices() {
  return supportsSpeech() ? window.speechSynthesis.getVoices() : []
}

/** A voice that reads Cantonese (zh-HK or the `yue` macrolanguage, or a known name). */
function isCantonese(v) {
  return (
    /yue/i.test(v.lang) ||
    /zh[-_]HK/i.test(v.lang) ||
    /cantonese|粵語?|sin-?ji/i.test(v.name || '')
  )
}

/** Pick the best installed voice for a BCP-47 lang tag (e.g. 'zh-HK', 'en', 'en-US'). */
function bestVoiceFor(lang) {
  const voices = getVoices()
  if (!voices.length) return null
  const norm = (s) => (s || '').toLowerCase()
  const langNorm = norm(lang)
  const base = langNorm.split('-')[0]
  return (
    voices.find((v) => norm(v.lang) === langNorm) || // exact match
    voices.find((v) => norm(v.lang).startsWith(base)) || // same base language
    (base === 'zh' ? voices.find(isCantonese) : null) || // Cantonese fallback for any zh*
    null
  )
}

/** True if the device has a Cantonese voice available (for UI hints / debugging). */
export function hasCantoneseVoice() {
  return getVoices().some(isCantonese)
}

/**
 * Speak `text` in the given language (default Cantonese zh-HK; pass 'en' for English).
 * Picks the best matching installed voice; safe no-op if speech synthesis is unavailable.
 * Cancels any in-flight speech so rapid taps don't pile up.
 */
export function speak(text, lang = 'zh-HK') {
  if (!supportsSpeech()) return
  const u = new SpeechSynthesisUtterance(text)
  const v = bestVoiceFor(lang)
  if (v) {
    u.voice = v // assign the specific voice explicitly (strongest signal to the engine)
    u.lang = v.lang
  } else {
    u.lang = lang
  }
  u.volume = 1 // maximum — speechSynthesis caps volume at 1.0
  u.rate = 0.75 // slow, clear pacing for young learners
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
