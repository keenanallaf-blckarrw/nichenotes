import { useEffect, useRef, useState } from 'react'
import { Bookmark, EyeOff, Heart, MoreHorizontal, Send, VolumeX } from 'lucide-react'
import { labelOf, VIBE_BY_ID } from '../../engine'
import type { AnyItem } from '../../data/types'
import { useStore } from '../../state/store'

function primaryVibe(item: AnyItem): string | undefined {
  return Object.entries(item.tags)
    .filter(([id]) => id in VIBE_BY_ID)
    .sort((a, b) => b[1] - a[1])[0]?.[0]
}

export function CardActions({ item, likes, tone = 'default' }: { item: AnyItem; likes?: number; tone?: 'default' | 'slab' }) {
  const store = useStore()
  const [menu, setMenu] = useState(false)
  const [shared, setShared] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const liked = store.liked.includes(item.id)
  const saved = store.saved.includes(item.id)
  const vibe = primaryVibe(item)

  useEffect(() => {
    if (!menu) return
    const close = (e: PointerEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false)
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [menu])

  const share = async () => {
    store.track('share', item)
    const text = item.type === 'quote' ? `"${item.translation ?? item.text}" — ${item.author}` : 'Found this on NicheNotes'
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* clipboard can be refused; the share still counts as a signal */
    }
    setShared(true)
    setTimeout(() => setShared(false), 1600)
  }

  const cls = tone === 'slab' ? 'icon-btn !text-slab-ink-2 hover:!bg-white/10 hover:!text-slab-ink aria-pressed:!text-slab-ink' : 'icon-btn'

  return (
    <div className="relative flex items-center gap-1">
      <button className={cls} aria-pressed={liked} aria-label={liked ? 'Unlike' : 'Like'} onClick={() => store.toggleLike(item)}>
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        {likes !== undefined && <span>{likes + (liked ? 1 : 0)}</span>}
      </button>
      <button className={cls} aria-pressed={saved} aria-label={saved ? 'Remove from Stash' : 'Save to Stash'} onClick={() => store.toggleSave(item)}>
        <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
      </button>
      <button className={cls} aria-label="Share" onClick={share}>
        <Send size={17} />
        {shared && <span className="text-xs">Copied</span>}
      </button>
      <div ref={menuRef} className="ml-auto">
        <button className={cls} aria-label="More options" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
          <MoreHorizontal size={18} />
        </button>
        {menu && (
          <div className="anim-fade absolute right-0 bottom-10 z-20 w-56 overflow-hidden rounded-xl border border-line bg-surface text-sm text-ink shadow-lg">
            <button className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-surface-2" onClick={() => (setMenu(false), store.hide(item))}>
              <EyeOff size={16} /> Not for me
            </button>
            {vibe && (
              <button className="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-left hover:bg-surface-2" onClick={() => (setMenu(false), store.mute(vibe))}>
                <VolumeX size={16} /> Mute {labelOf(vibe)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
