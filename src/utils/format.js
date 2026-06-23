/** Format milliseconds as a friendly duration: "12.3s" or "1:05". */
export function formatDuration(ms) {
  const totalSec = ms / 1000
  if (totalSec < 60) return totalSec.toFixed(1) + 's'
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
