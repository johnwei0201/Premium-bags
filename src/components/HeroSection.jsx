import { forwardRef } from 'react'
import styles from './HeroSection.module.css'

// 英文品牌名拆成一個一個字母，才能平均撒開、跟上面中文標題一樣寬（仿照 Logo）
const brandLetters = 'WenYuanChen'.split('')

// 第 1 屏：墨綠滿版開場
// ref：首頁要拿這一屏去偵測「還在不在畫面上」
const HeroSection = forwardRef(function HeroSection(props, ref) {
  return (
    <section ref={ref} className={`screen ${styles.hero}`}>
      {/* 品牌名：中文標題 + 英文 + SINCE 1983（跟 Logo 同樣的排法） */}
      <div className={styles.heroBrand}>
        <h1 className={styles.heroTitle}>陳文遠精品包研習會所</h1>

        <p className={styles.heroEn} lang="en" aria-label="WenYuanChen">
          {brandLetters.map((letter, index) => (
            <span key={index} aria-hidden="true">
              {letter}
            </span>
          ))}
        </p>

        <p className={styles.heroSince} lang="en">
          SINCE 1983
        </p>
      </div>

      <div className={styles.heroText}>
        <p>
          致力於探索細節與手工工藝，以皮革的溫度串起每一段故事。這裡是假文示意，之後會換成品牌介紹，
          讓每一只包款都承載獨特的質感與記憶。
        </p>
        <p>
          以不受時間限制的設計為核心，這段同樣是假文示意，之後會換成品牌理念，
          獻給追求品質、風格與美感的每一個人。
        </p>
      </div>
    </section>
  )
})

export default HeroSection
