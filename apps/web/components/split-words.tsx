import { Fragment, type CSSProperties } from 'react'
import { splitWords } from '@/lib/motion-math'

type Props = {
  text: string
  /** Index of the first word, so several runs in one heading keep one stagger. */
  start?: number
}

/** Wraps each word in a mask so CSS can slide it up. Spaces sit between masks so lines still wrap naturally. */
export function SplitWords({ text, start = 0 }: Props) {
  const words = splitWords(text)
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="split-word" style={{ '--i': start + i } as CSSProperties}>
            <span className="split-word__inner">{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  )
}
