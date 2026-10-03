import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useOutletContext } from 'react-router'
import HeroSection from '../components/HeroSection.jsx'
import SplitSection from '../components/SplitSection.jsx'
import FinalSection from '../components/FinalSection.jsx'
import styles from './HomeView.module.css'

// 左右對半的屏：第 2 屏 + 中間 6 屏 = 7 屏（編號 2～8）
const splitScreens = [2, 3, 4, 5, 6, 7, 8]

// 放在元件外面的小倉庫：離開首頁後還記得捲到哪裡（元件被拿掉時，裡面的變數會跟著消失）
// 鑰匙：這一筆歷史紀錄的編號（location.key）；值：捲到的位置
// 同一筆紀錄（按「上一頁」）回來才還原；從 Logo 點進來的是新紀錄，就從第 1 屏開始
const savedScroll = new Map()

// 首頁：一屏一屏的版面
// onHeroVisible：第 1 屏在不在畫面上，告訴 App（用來決定導覽列要不要出現）
export default function HomeView() {
  const { onHeroVisible } = useOutletContext()
  const location = useLocation()
  const heroRef = useRef(null)

  // 首頁「自己捲自己」：9 屏裝在一個固定大小的框（mainRef）裡，只有框裡面在捲
  // 整個網頁不捲 → 手機網址列不會縮放 → 每一屏高度固定，一屏一屏吸附才順
  const mainRef = useRef(null)

  // ---------- 記住捲到第幾屏 ----------
  // 用 useLayoutEffect：畫面畫出來之前就捲好，不會先閃一下第 1 屏
  useLayoutEffect(() => {
    const main = mainRef.current
    const key = location.key
    const saved = savedScroll.get(key)
    if (saved) {
      // 按「上一頁」回來：回到原本那一屏
      main.scrollTop = saved
    } else if (location.hash === '#featured') {
      // 從導覽列「回精選區」過來（網址 /#featured）：直接停在精選展示屏（第 2 屏）
      main.scrollTop = main.querySelectorAll('.screen')[1].offsetTop
    }
    // 離開首頁的那一刻（框還在畫面上）記下位置
    return () => savedScroll.set(key, main.scrollTop)
  }, [location.key, location.hash])

  // 點擊畫面任一處，就捲到下一屏（點到連結、按鈕時不動作）
  useEffect(() => {
    const main = mainRef.current

    function goToNextScreen(event) {
      if (event.target.closest('a, button, input, textarea, select')) return

      const screens = [...main.querySelectorAll('.screen')]
      // 目前這一屏：最後一個「頂端已經捲到（或超過）框的頂端」的屏
      const current = screens.findLastIndex((screen) => screen.offsetTop <= main.scrollTop + 1)
      screens[current + 1]?.scrollIntoView({ behavior: 'smooth' }) // 已經是最後一屏就不動
    }

    document.addEventListener('click', goToNextScreen)
    return () => document.removeEventListener('click', goToNextScreen)
  }, [])

  // 第 1 屏露出不到一半時，導覽列就出現
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => onHeroVisible(entry.isIntersecting), { threshold: 0.5 })
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [onHeroVisible])

  return (
    <main ref={mainRef} className={styles.home}>
      <HeroSection ref={heroRef} />
      {splitScreens.map((number) => (
        <SplitSection key={number} number={number} />
      ))}
      <FinalSection />
    </main>
  )
}
