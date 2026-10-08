// Text-to-speech via the browser's built-in speechSynthesis. No audio files, no new
// dependencies — matches the no-asset philosophy of utils/sound.js.
//
// Used by the Chinese game (Cantonese, 廣東話) and the English/Dictation games
// (English). speak() takes a BCP-47 lang tag and picks the best matching installed voice.
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

let cachedVoices = []

function refreshVoices() {
  cachedVoices = supportsSpeech() ? window.speechSynthesis.getVoices() : []
}

if (supportsSpeech()) {
  refreshVoices()
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
}

function getVoices() {
  if (!cachedVoices.length) refreshVoices()
  return cachedVoices
}

/** A voice that reads Cantonese (zh-HK or the `yue` macrolanguage, or a known name). */
function isCantonese(v) {
  return (
    /yue/i.test(v.lang) ||
    /zh[-_]HK/i.test(v.lang) ||
    /cantonese|粵語?|sin-?ji/i.test(v.name || '')
  )
}

const FEMALE_VOICE_NAMES =
  /female|woman|samantha|karen|moira|tessa|fiona|victoria|susan|zira|aria|jenny|sonia|ava|allison|serena|kate|kathy/i

function isLikelyFemaleVoice(voice) {
  return FEMALE_VOICE_NAMES.test(voice.name || '')
}

/** Pick the best installed voice for a BCP-47 lang tag (e.g. 'zh-HK', 'en', 'en-US'). */
function bestVoiceFor(lang, preferFemale = false, preferredVoiceNames = []) {
  const voices = getVoices()
  if (!voices.length) return null
  const norm = (s) => (s || '').toLowerCase()
  const langNorm = norm(lang)
  const base = langNorm.split('-')[0]
  const exactVoices = voices.filter((voice) => norm(voice.lang) === langNorm)
  const baseVoices = voices.filter((voice) => norm(voice.lang).startsWith(base))
  const matchingVoices = exactVoices.length ? exactVoices : baseVoices

  for (const preferredName of preferredVoiceNames) {
    const preferredVoice = matchingVoices.find((voice) =>
      norm(voice.name).includes(norm(preferredName)),
    )
    if (preferredVoice) return preferredVoice
  }

  if (preferFemale) {
    const femaleVoice =
      exactVoices.find(isLikelyFemaleVoice) || baseVoices.find(isLikelyFemaleVoice)
    if (femaleVoice) return femaleVoice
  }

  return (
    exactVoices[0] || // exact match
    baseVoices[0] || // same base language
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
export function speak(
  text,
  lang = 'zh-HK',
  { rate = 0.75, preferFemale = false, preferredVoiceNames = [] } = {},
) {
  if (!supportsSpeech()) return
  const u = new SpeechSynthesisUtterance(text)
  const v = bestVoiceFor(lang, preferFemale, preferredVoiceNames)
  if (v) {
    u.voice = v // assign the specific voice explicitly (strongest signal to the engine)
    u.lang = v.lang
  } else {
    u.lang = lang
  }
  u.volume = 1 // maximum — speechSynthesis caps volume at 1.0
  u.rate = Math.min(2, Math.max(0.1, rate))
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
