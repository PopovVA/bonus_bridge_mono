/** Returns whether the value was written to the clipboard. */
export async function tryWriteClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
