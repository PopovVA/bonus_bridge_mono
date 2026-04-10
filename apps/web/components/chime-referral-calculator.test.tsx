import { afterEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'

const track = vi.fn()

vi.mock('@/lib/gtag-track', () => ({
  trackGtagEvent: (...args: unknown[]) => track(...args)
}))

describe('ChimeReferralCalculator', () => {
  afterEach(() => {
    track.mockReset()
    vi.useRealTimers()
  })

  it('renders totals and sends debounced analytics', async () => {
    vi.useFakeTimers()
    const { ChimeReferralCalculator } = await import('./chime-referral-calculator')
    ;(globalThis as { React?: typeof React }).React = React
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(<ChimeReferralCalculator articleSlug="chime-1000-two-friends" />)
    })
    expect(el.textContent).toContain('Profit Calculator')
    expect(el.textContent).toContain('Estimated total for you')
    await act(async () => {
      vi.advanceTimersByTime(450)
    })
    expect(track).toHaveBeenCalled()
    expect(track.mock.calls[0][0]).toBe('chime_calc_update')
    root.unmount()
    el.remove()
  })

  it('updates number inputs, toggles DD row, and debounces analytics again', async () => {
    vi.useFakeTimers()
    const { ChimeReferralCalculator } = await import('./chime-referral-calculator')
    ;(globalThis as { React?: typeof React }).React = React
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(<ChimeReferralCalculator articleSlug="chime-1000-two-friends" />)
    })
    const friendsInput = el.querySelector('.article-calculator__input--num') as HTMLInputElement
    const ddSwitch = el.querySelector('[role="switch"]') as HTMLButtonElement
    const setNumber = (input: HTMLInputElement, value: string) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
      setter?.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
    await act(() => {
      setNumber(friendsInput, '5')
    })
    expect(friendsInput.value).toBe('5')
    await act(() => {
      setNumber(friendsInput, '02')
    })
    expect(friendsInput.value).toBe('2')
    await act(() => {
      friendsInput.focus()
    })
    await act(() => {
      setNumber(friendsInput, '')
    })
    expect(friendsInput.value).toBe('')
    await act(() => {
      friendsInput.blur()
    })
    expect(friendsInput.value).toBe('2')
    await act(() => {
      setNumber(friendsInput, '7')
    })
    expect(friendsInput.value).toBe('7')
    await act(() => {
      ddSwitch.click()
    })
    expect(el.textContent).not.toContain('Your direct-deposit bonus (modeled)')
    track.mockClear()
    await act(async () => {
      vi.advanceTimersByTime(450)
    })
    expect(track).toHaveBeenCalled()
    root.unmount()
    el.remove()
  })

  it('embedded mode omits card heading and lead copy', async () => {
    const { ChimeReferralCalculator } = await import('./chime-referral-calculator')
    ;(globalThis as { React?: typeof React }).React = React
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(
        <ChimeReferralCalculator
          articleSlug="chime-1000-two-friends"
          showHeading={false}
          showLead={false}
        />
      )
    })
    expect(el.querySelector('.article-calculator__title')).toBeNull()
    expect(el.textContent).not.toContain('per qualifying friend')
    expect(el.querySelector('.article-calculator--embedded')).toBeTruthy()
    expect(el.textContent).toContain('Estimated total for you')
    root.unmount()
    el.remove()
  })
})
