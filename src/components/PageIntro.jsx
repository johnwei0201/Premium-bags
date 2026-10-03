import styles from './PageIntro.module.css'

// 內頁開頭：英文小標 + 襯線大標題 + 簡介（包款展示、影片、課程、最新消息共用）
// 刻意做得精簡：一進來就能瞄到下面的照片
// label：英文小標，例如 COLLECTION；title：中文大標題；children：簡介
export default function PageIntro({ label, title, children }) {
  return (
    <header className={styles.intro}>
      <p className={styles.introLabel} lang="en">
        {label}
      </p>
      <h1 className={styles.introTitle}>{title}</h1>
      <p className={styles.introText}>{children}</p>
    </header>
  )
}
