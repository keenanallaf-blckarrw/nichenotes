import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type SheetState = { kind: 'item'; id: string } | { kind: 'shop'; id: string } | { kind: 'suggest' } | null

interface UI {
  sheet: SheetState
  open: (s: Exclude<SheetState, null>) => void
  close: () => void
}

const Ctx = createContext<UI | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetState>(null)
  const open = useCallback((s: Exclude<SheetState, null>) => setSheet(s), [])
  const close = useCallback(() => setSheet(null), [])
  return <Ctx.Provider value={{ sheet, open, close }}>{children}</Ctx.Provider>
}

export function useUI(): UI {
  const v = useContext(Ctx)
  if (!v) throw new Error('useUI outside UIProvider')
  return v
}
