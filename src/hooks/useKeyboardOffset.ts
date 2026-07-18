import { useEffect } from 'react'

export function useKeyboardOffset(cssVarName = '--keyboard-offset'): void {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      const occluded = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      )
      document.documentElement.style.setProperty(
        cssVarName,
        `${Math.round(occluded)}px`,
      )
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    window.addEventListener('focusin', update)
    window.addEventListener('focusout', update)

    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      window.removeEventListener('focusin', update)
      window.removeEventListener('focusout', update)
      document.documentElement.style.setProperty(cssVarName, '0px')
    }
  }, [cssVarName])
}
