import { vi } from 'vitest'

vi.mock('next/font/google', () => ({
  Fraunces: () => ({ variable: '--font-chime-serif' }),
  Plus_Jakarta_Sans: () => ({ variable: '--font-chime-ui' })
}))
