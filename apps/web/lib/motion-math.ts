export type Box = { left: number; top: number; width: number; height: number }

/** Pointer position relative to a box, in px. Drives the cursor spotlight on cards. */
export function pointInBox(clientX: number, clientY: number, box: Box) {
  return { x: clientX - box.left, y: clientY - box.top }
}

/**
 * How far a magnetic button follows the pointer: a fraction of the distance
 * from its centre, clamped so it never drifts far from its slot.
 */
export function magneticOffset(clientX: number, clientY: number, box: Box, strength = 0.3, max = 12) {
  const clamp = (v: number) => Math.max(-max, Math.min(max, v))
  const dx = clientX - (box.left + box.width / 2)
  const dy = clientY - (box.top + box.height / 2)
  return { x: clamp(dx * strength), y: clamp(dy * strength) }
}

export function easeOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return 1 - (1 - c) ** 3
}

/** Integer shown at `progress` (0..1) of a count-up toward `target`. */
export function countUpValue(target: number, progress: number): number {
  return Math.round(target * easeOutCubic(progress))
}

/** Circle that covers the whole viewport from (x, y): radius to the farthest corner. */
export function revealRadius(x: number, y: number, width: number, height: number): number {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
}

export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

/** Scroll velocity (px/s) to a gentle skew in degrees, clamped. */
export function velocitySkew(velocity: number, max = 6): number {
  return Math.max(-max, Math.min(max, velocity / 300))
}
