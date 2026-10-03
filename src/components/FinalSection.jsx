import PhotoPlaceholder from './PhotoPlaceholder.jsx'
import SiteFooter from './SiteFooter.jsx'
import styles from './FinalSection.module.css'

// 最後一屏：上面大圖 + 下面頁尾，一起塞滿一個畫面
export default function FinalSection() {
  return (
    <section className={`screen ${styles.final}`}>
      <div className={styles.finalPhoto}>
        <PhotoPlaceholder label="最後一屏・滿版" tone="dark" />

        <div className={styles.finalCaption}>
          <span className={styles.finalTag}>假文</span>
          <a href="#" className={styles.finalTitle}>
            假文大標題
          </a>
        </div>
      </div>

      <SiteFooter />
    </section>
  )
}
