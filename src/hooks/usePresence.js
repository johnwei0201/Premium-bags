import { useEffect, useLayoutEffect, useState } from 'react'

// 淡入淡出用（取代 Vue 的 <Transition>）
// open 變 true：先放進畫面（mounted，此時還是透明的），再加上 shown，CSS 才有「從透明變不透明」的過程
// open 變 false：先拿掉 shown 播淡出，等 duration 毫秒播完，才真的從畫面移除
export function usePresence(open, duration = 300) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(open)

  // 打開：先放進畫面
  if (open && !mounted) setMounted(true)

  // 放進畫面後：讓瀏覽器先記住「透明」的樣子（讀一次 offsetHeight），再換成 shown，淡入才播得出來
  useLayoutEffect(() => {
    if (!open || !mounted) return
    void document.body.offsetHeight
    setShown(true)
  }, [open, mounted])

  // 關閉：播完淡出才移除
  useEffect(() => {
    if (open) return
    setShown(false)
    const timer = setTimeout(() => setMounted(false), duration)
    return () => clearTimeout(timer)
  }, [open, duration])

  return { mounted, shown }
}

// 有沒有「站內的上一頁」：React Router 會在 history.state 記下第幾筆（idx），0 代表是第一頁
export const hasPreviousPage = () => (window.history.state?.idx ?? 0) > 0

// 按住 Ctrl／⌘／Shift 點，或按滑鼠中鍵：照瀏覽器原本的「開新分頁」，不攔截
export const isModifiedClick = (event) =>
  event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0
