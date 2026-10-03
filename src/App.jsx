import { useCallback, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import SiteHeader from './components/SiteHeader.jsx'
import AuthModal from './components/AuthModal.jsx'

// 總指揮：導覽列、會員彈窗全站共用，中間的內容隨網址換頁（Outlet）
export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  // 會員登入 / 註冊彈窗是否打開
  const [authOpen, setAuthOpen] = useState(false)
  // useCallback：每次都是同一個函式，彈窗才不會以為「又被打開一次」
  const openAuth = useCallback(() => setAuthOpen(true), [])
  const closeAuth = useCallback(() => setAuthOpen(false), [])

  // 首頁第 1 屏在畫面上時，先把導覽列藏起來；其他頁面一律顯示
  const [heroVisible, setHeroVisible] = useState(true)
  const showHeader = !isHome || !heroVisible

  return (
    <>
      <SiteHeader visible={showHeader} solid={!isHome} onOpenAccount={openAuth} />
      <AuthModal open={authOpen} onClose={closeAuth} />

      {/* 首頁要回報「第 1 屏在不在畫面上」，用 context 把 setter 交給它 */}
      <Outlet context={{ onHeroVisible: setHeroVisible }} />

      {/* 換頁時的捲動：按「上一頁」回到原本的位置；進新頁面從最上面開始
          （只換分類 ?category= 時，包款展示會加上 preventScrollReset，不跳回頂端） */}
      <ScrollRestoration />
    </>
  )
}
