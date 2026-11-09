import { describe, expect, it } from 'vitest'
import {
  countUpValue,
  easeOutCubic,
  magneticOffset,
  pointInBox,
  revealRadius,
  splitWords,
  velocitySkew
} from '@/lib/motion-math'

const box = { left: 100, top: 50, width: 200, height: 40 }

describe('motion math', () => {
  it('maps the pointer into box space', () => {
    expect(pointInBox(150, 60, box)).toEqual({ x: 50, y: 10 })
  })

  it('pulls toward the pointer and clamps the pull', () => {
    expect(magneticOffset(200, 70, box)).toEqual({ x: 0, y: 0 })
    expect(magneticOffset(220, 80, box)).toEqual({ x: 6, y: 3 })
    expect(magneticOffset(900, -900, box)).toEqual({ x: 12, y: -12 })
    expect(magneticOffset(220, 70, box, 1, 5)).toEqual({ x: 5, y: 0 })
  })

  it('eases and clamps progress', () => {
    expect(easeOutCubic(-1)).toBe(0)
    expect(easeOutCubic(0.5)).toBe(0.875)
    expect(easeOutCubic(2)).toBe(1)
  })

  it('counts up to the exact target', () => {
    expect(countUpValue(12, 0)).toBe(0)
    expect(countUpValue(12, 0.5)).toBe(11)
    expect(countUpValue(12, 1)).toBe(12)
  })

  it('covers the farthest corner', () => {
    expect(revealRadius(0, 0, 3, 4)).toBe(5)
    expect(revealRadius(3, 4, 3, 4)).toBe(5)
  })

  it('splits words on any whitespace', () => {
    expect(splitWords('  Referral   guides\nand terms ')).toEqual(['Referral', 'guides', 'and', 'terms'])
    expect(splitWords('   ')).toEqual([])
  })

  it('turns scroll velocity into a bounded skew', () => {
    expect(velocitySkew(0)).toBe(0)
    expect(velocitySkew(600)).toBe(2)
    expect(velocitySkew(-99999)).toBe(-6)
  })
})
