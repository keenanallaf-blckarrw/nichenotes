import { useEffect, useRef, useState } from 'react'
import { Bookmark, EyeOff, Heart, Info, MoreHorizontal, Share, VolumeX } from 'lucide-react'
import { labelOf, VIBE_BY_ID } from '../../engine'
import type { AnyItem } from '../../data/types'
import { useStore } from '../../state/store'

function primaryVibe(item: AnyItem): string | undefined {
  return Object.entries(item.tags)
    .filter(([id]) => id in VIBE_BY_ID)
    .sort((a, b) => b[1] - a[1])[0]?.[0]
}

/** Like and save up front; everything else lives in the ••• menu. */
export function CardActions({ item, likes, why }: { item: AnyItem; likes?: number; why?: string }) {
  const store = useStore()
  const [menu, setMenu] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const liked = store.liked.includes(item.id)
  const saved = store.saved.includes(item.id)
  const vibe = primaryVibe(item)

  useEffect(() => {
    if (!menu) return
    const close = (e: PointerEvent) => !menuRef.current?.contains(e.target as Node) && (setMenu(false), setShowWhy(false))
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [menu])

  const share = async () => {
    store.track('share', item)
    const text = item.type === 'quote' ? `"${item.translation ?? item.text}" (${item.author})` : 'Found this on NicheNotes'
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* Clipboard can be refused; the share still counts as a signal. */
    }
    setCopied(true)
    setTimeout(() => (setCopied(false), setMenu(false)), 1100)
  }

  const row = 'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[15px] hover:bg-surface-2'

  return (
    <div className="relative -mx-1.5 flex items-center gap-1">
      <button className="icon-btn" aria-pressed={liked} aria-label={liked ? 'Unlike' : 'Like'} onClick={() => store.toggleLike(item)}>
        <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
        {likes !== undefined && <span>{compactLikes(likes + (liked ? 1 : 0))}</span>}
      </button>
      <button className="icon-btn" aria-pressed={saved} aria-label={saved ? 'Remove from Saved' : 'Save'} onClick={() => store.toggleSave(item)}>
        <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
      </button>
      <div ref={menuRef} className="ml-auto">
        <button className="icon-btn" aria-label="More" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
          <MoreHorizontal size={20} />
        </button>
        {menu && (
          <div className="anim-fade absolute right-0 bottom-11 z-20 w-64 overflow-hidden rounded-[14px] bg-surface text-ink shadow-[0_8px_40px_rgb(0_0_0/0.18)]">
            {why && (
              <button className={row} onClick={() => setShowWhy((v) => !v)} aria-expanded={showWhy}>
                Why am I seeing this? <Info size={17} className="text-ink-2" />
              </button>
            )}
            {why && showWhy && <p className="px-4 pb-3 text-[13px] text-ink-2">{why}</p>}
            <button className={`${row} border-t-[0.5px] border-line`} onClick={share}>
              {copied ? 'Copied' : 'Share'} <Share size={17} className="text-ink-2" />
            </button>
            <button className={`${row} border-t-[0.5px] border-line`} onClick={() => (setMenu(false), store.hide(item))}>
              Not interested <EyeOff size={17} className="text-ink-2" />
            </button>
            {vibe && (
              <button className={`${row} border-t-[0.5px] border-line`} onClick={() => (setMenu(false), store.mute(vibe))}>
                Hide all {labelOf(vibe)} <VolumeX size={17} className="text-ink-2" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function compactLikes(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}
