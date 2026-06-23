import confetti from 'canvas-confetti'

const COLORS = ['#ff6b9d', '#ffd43b', '#4dabf7', '#51cf66', '#9b5de5', '#ff922b']

/** Quick celebratory burst — used on each correct answer. */
export function burst() {
  confetti({
    particleCount: 70,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.65 },
    colors: COLORS,
    scalar: 1.1,
  })
}

/** Bigger two-sided celebration — used on the results screen for great rounds. */
export function celebrate() {
  const end = Date.now() + 1000
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors: COLORS })
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors: COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
