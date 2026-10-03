import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePresence } from '../hooks/usePresence.js'
import styles from './AuthModal.module.css'

// 會員彈窗：登入 / 註冊兩種模式，同一個框切換
// open：是否打開；onClose：要關閉時通知 App
export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState('login') // 'login' 或 'register'
  const [showPassword, setShowPassword] = useState(false)
  const cardRef = useRef(null)
  const modal = usePresence(open)
  const isLogin = mode === 'login'

  function switchMode(next) {
    setMode(next)
    setShowPassword(false)
  }

  // 打開時：回到登入模式、鎖住背景捲動、可以按 Esc 關閉
  useEffect(() => {
    if (!open) return
    setMode('login')
    setShowPassword(false)
    const onKeydown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.documentElement.classList.add('no-scroll')
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.documentElement.classList.remove('no-scroll')
      document.removeEventListener('keydown', onKeydown)
    }
  }, [open, onClose])

  // 彈窗出現、或切換登入／註冊時：游標移到第一個欄位
  useEffect(() => {
    if (open && modal.mounted) cardRef.current?.querySelector('input')?.focus()
  }, [open, modal.mounted, mode])

  // 彈窗裡的點擊不往外傳（不然會觸發首頁的「點一下換下一屏」）
  // 點到卡片外面的暗色背景 → 關閉
  function onOverlayClick(event) {
    event.stopPropagation()
    if (event.target === event.currentTarget) onClose()
  }

  // 還沒有後端，先擋住送出（之後串接會員系統時改這裡）
  function onSubmit(event) {
    event.preventDefault()
  }

  if (!modal.mounted) return null

  const passwordType = showPassword ? 'text' : 'password'

  return createPortal(
    <div className={`${styles.authOverlay} ${modal.shown ? styles.authOverlayShown : ''}`} onClick={onOverlayClick}>
      <div ref={cardRef} className={styles.authCard} role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button type="button" className={styles.authClose} aria-label="關閉" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        {/* 標題列：左邊目前模式，右邊切換到另一個模式 */}
        <div className={styles.authHead}>
          <h2 id="auth-title" className={styles.authTitle}>
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </h2>
          <button type="button" className={styles.authSwitch} onClick={() => switchMode(isLogin ? 'register' : 'login')}>
            {isLogin ? (
              <>
                REGISTER <span aria-hidden="true">→</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">←</span> LOGIN
              </>
            )}
          </button>
        </div>

        <form className={styles.authForm} onSubmit={onSubmit}>
          {!isLogin && (
            <label className={styles.field}>
              <span className={styles.visuallyHidden}>姓名</span>
              <input type="text" name="name" placeholder="姓名" autoComplete="name" required />
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.visuallyHidden}>電子信箱</span>
            <input type="email" name="email" placeholder="電子信箱" autoComplete="email" required />
          </label>

          <label className={styles.field}>
            <span className={styles.visuallyHidden}>密碼</span>
            <input
              type={passwordType}
              name="password"
              placeholder="密碼"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={isLogin ? undefined : 8}
              required
            />
            {/* 眼睛圖示：切換顯示 / 隱藏密碼 */}
            <button
              type="button"
              className={styles.fieldEye}
              aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 10c2.4 3 5.4 4.5 9 4.5s6.6-1.5 9-4.5" />
                  <path d="M12 14.5V17M7 13.3l-1.3 2.2M17 13.3l1.3 2.2M3.8 11l-1.8 1.6M20.2 11l1.8 1.6" />
                </svg>
              )}
            </button>
          </label>

          {!isLogin && (
            <label className={styles.field}>
              <span className={styles.visuallyHidden}>確認密碼</span>
              <input type={passwordType} name="password-confirm" placeholder="確認密碼" autoComplete="new-password" required />
            </label>
          )}

          {isLogin && (
            <a href="#" className={styles.authForgot} onClick={(event) => event.preventDefault()}>
              Forgot password?
            </a>
          )}

          <button type="submit" className={styles.authSubmit}>
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}
