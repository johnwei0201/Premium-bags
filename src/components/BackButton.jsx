import { useNavigate } from 'react-router'
import { hasPreviousPage } from '../hooks/usePresence.js'
import styles from './BackButton.module.css'

// 返回按鈕：平常「← BACK」，滑鼠移上去換成較小、有底線的「返回」（跟導覽列同一套）
// 從網站裡點進來 → 回到上一頁（會回到原本捲到的位置、選的分類）
// 直接打開網址（沒有上一頁）→ 去 fallback 指定的頁面，不會跳出網站
export default function BackButton({ fallback }) {
  const navigate = useNavigate()

  function goBack() {
    if (hasPreviousPage()) navigate(-1)
    else navigate(fallback)
  }

  return (
    <button type="button" className={styles.back} onClick={goBack}>
      <span className={styles.backArrow} aria-hidden="true">
        ←
      </span>
      <span className={styles.backEn} lang="en">
        BACK
      </span>
      <span className={styles.backZh}>返回</span>
    </button>
  )
}
