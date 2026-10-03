import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router'
import { usePresence, hasPreviousPage, isModifiedClick } from '../hooks/usePresence.js'
// Logo：用縮小過的網頁版（原檔 2172px、1.3MB 太大，網頁版 540px、約 127KB）
import logoUrl from '../images/set/logo-web.png'
import styles from './SiteHeader.module.css'

// 平常顯示英文（en），滑鼠移上去換成中文（zh）
// 左邊：站內頁面，用 Link 換頁（to 是網址）
const leftLinks = [
  { en: 'BAGS', zh: '包款', to: '/collection' }, // 包款展示
  { en: 'FILMS', zh: '影片', to: '/films', note: '(僅限會員)' }, // 影片；note：滑過時顯示在下方的小字
  { en: 'COURSES', zh: '課程', to: '/courses' }, // 課程
  { en: 'NEWS', zh: '最新消息', to: '/news' }, // 最新消息
  { en: 'FEATURED', zh: '回精選區', featured: true }, // 回首頁的「精選展示屏」（第 2 屏）
]

const rightLinks = [
  { en: 'SEARCH', zh: '搜尋' },
  { en: 'ACCOUNT', zh: '會員', openAccount: true }, // 打開會員彈窗
]

// 英文、中文疊在同一格的那兩個 span
function LinkLabel({ link }) {
  return (
    <>
      <span className={styles.navLinkEn} lang="en">
        {link.en}
      </span>
      <span className={styles.navLinkZh} aria-hidden="true">
        {link.zh}
      </span>
    </>
  )
}

// 導覽列：固定在畫面最上方、背景透明、白字疊在照片上
// visible：在首頁第 1 屏時隱藏；solid：首頁以外的頁面加上黑底，文字才看得清楚
// onOpenAccount：點「ACCOUNT」時通知 App 打開會員彈窗
export default function SiteHeader({ visible = true, solid = false, onOpenAccount }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  // ☰ 選單：螢幕寬度 1199px 以下放不下左邊 5 個連結，收進全螢幕選單
  const [menuOpen, setMenuOpen] = useState(false)
  const menu = usePresence(menuOpen)

  // 在首頁時不顯示「回精選區」（首頁本身就有精選展示屏），其他頁面才出現
  const visibleLeftLinks = leftLinks.filter((link) => !(link.featured && isHome))

  // 點 Logo 回首頁第 1 屏
  // - 在其他頁面：換頁到首頁
  // - 已經在首頁：平滑捲回第 1 屏
  //   （首頁有「一屏一屏吸附」，iPhone Safari 會把一般的「瞬間捲到頂」吸回原本那屏，
  //    所以改用 scrollIntoView，跟「點一下換下一屏」同一種做法，手機上才確定有效）
  function onLogoClick(event) {
    if (isModifiedClick(event)) return
    event.preventDefault()
    if (isHome) {
      document.querySelector('.screen')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  // 點「回精選區」：回到首頁的精選展示屏（第 2 屏）
  // - 已經在首頁：平滑捲到第 2 屏（跟 Logo 同一種做法，手機上才順）
  // - 在其他頁面：換頁到 /#featured，首頁打開時會直接停在第 2 屏
  function onFeaturedClick(event) {
    if (isModifiedClick(event)) return
    event.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      document.querySelectorAll('.screen')[1]?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#featured')
    }
  }

  function onRightLinkClick(event, link) {
    event.preventDefault() // 目前都還沒有網址，不要跳回頁首
    if (link.openAccount) onOpenAccount()
  }

  // 選單打開時：鎖住背景捲動、可以按 Esc 關閉
  useEffect(() => {
    if (!menuOpen) return
    const onKeydown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.documentElement.classList.add('no-scroll')
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.documentElement.classList.remove('no-scroll')
      document.removeEventListener('keydown', onKeydown)
    }
  }, [menuOpen])

  // 換頁後自動收起選單
  useEffect(() => {
    setMenuOpen(false)
  }, [location.key])

  // 選單裡的點擊不往外傳（不然會觸發首頁的「點一下換下一屏」）；點空白處關閉
  function onMenuClick(event) {
    event.stopPropagation()
    if (event.target === event.currentTarget) setMenuOpen(false)
  }

  // 選單裡的「回上一頁」：有上一頁就回去（換頁後選單會自動收起）；
  // 直接打開網址、沒有上一頁時，就只關掉選單，停在目前這頁
  function menuGoBack() {
    if (hasPreviousPage()) navigate(-1)
    else setMenuOpen(false)
  }

  const headerClass = [styles.header, !visible && styles.headerHidden, solid && styles.headerSolid]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={headerClass}>
        {/* 1199px 以下才出現：☰ 選單按鈕 */}
        <button
          type="button"
          className={styles.menuToggle}
          aria-label="開啟選單"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </button>

        <nav className={`${styles.nav} ${styles.navLeft}`}>
          {visibleLeftLinks.map((link) =>
            link.featured ? (
              // 回精選區：不是換頁，而是捲到首頁第 2 屏，所以自己處理點擊
              <a key={link.en} href="/#featured" className={styles.navLink} aria-label={link.zh} onClick={onFeaturedClick}>
                <LinkLabel link={link} />
              </a>
            ) : (
              <Link key={link.en} to={link.to} className={styles.navLink}>
                <LinkLabel link={link} />
                {link.note && <span className={styles.navLinkNote}>{link.note}</span>}
              </Link>
            ),
          )}
        </nav>

        {/* Logo：點了回首頁 */}
        <a href="/" className={styles.logo} aria-label="陳文遠精品包研所，回首頁" onClick={onLogoClick}>
          <img src={logoUrl} alt="" className={styles.logoImg} />
        </a>

        <nav className={`${styles.nav} ${styles.navRight}`}>
          {rightLinks.map((link) => (
            <a key={link.en} href="#" className={styles.navLink} onClick={(event) => onRightLinkClick(event, link)}>
              <LinkLabel link={link} />
            </a>
          ))}

          {/* 社群圖示（左右並排） */}
          <div className={styles.social}>
            <a href="#" className={styles.socialLink} aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>

      {/* 全螢幕選單：中文大字 + 英文小字（掛到 body 底下） */}
      {menu.mounted &&
        createPortal(
          <div
            id="mobile-menu"
            className={`${styles.mobileMenu} ${menu.shown ? styles.mobileMenuShown : ''}`}
            onClick={onMenuClick}
          >
            <button type="button" className={styles.menuClose} aria-label="關閉選單" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>

            <nav className={styles.mobileMenuList} aria-label="主選單">
              {visibleLeftLinks.map((link) => {
                const content = (
                  <>
                    <span className={styles.mobileMenuZh}>{link.zh}</span>
                    <span className={styles.mobileMenuEn} lang="en">
                      {link.en}
                      {link.note && `　${link.note}`}
                    </span>
                  </>
                )
                return link.featured ? (
                  <a key={link.en} href="/#featured" className={styles.mobileMenuLink} onClick={onFeaturedClick}>
                    {content}
                  </a>
                ) : (
                  <Link key={link.en} to={link.to} className={styles.mobileMenuLink}>
                    {content}
                  </Link>
                )
              })}
            </nav>

            {/* 右下角：回上一頁 */}
            <button type="button" className={styles.menuBack} onClick={menuGoBack}>
              <span className={styles.menuBackArrow} aria-hidden="true">
                ←
              </span>
              <span>回上一頁</span>
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
