import { useState } from 'react'
import PageIntro from '../components/PageIntro.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import styles from './FilmsView.module.css'

// 影片：版型跟包款展示一樣（開頭 + 分類篩選 + 格狀排列），畫面改成橫式 16:9
const categories = [
  { key: 'all', en: 'ALL', zh: '全部' },
  { key: 'story', en: 'BRAND STORY', zh: '品牌故事' },
  { key: 'craft', en: 'CRAFTSMANSHIP', zh: '工藝' },
  { key: 'collection', en: 'COLLECTION', zh: '系列' },
  { key: 'behind', en: 'BEHIND THE SCENES', zh: '幕後' },
]

// 影片資料（先放假文，之後換成真的標題、影片）
const films = [
  { id: 1, category: 'story', title: '假文影片標題 01', duration: '02:30' },
  { id: 2, category: 'craft', title: '假文影片標題 02', duration: '04:15' },
  { id: 3, category: 'collection', title: '假文影片標題 03', duration: '01:45' },
  { id: 4, category: 'behind', title: '假文影片標題 04', duration: '03:20' },
  { id: 5, category: 'craft', title: '假文影片標題 05', duration: '05:10' },
  { id: 6, category: 'story', title: '假文影片標題 06', duration: '02:05' },
  { id: 7, category: 'collection', title: '假文影片標題 07', duration: '01:30' },
  { id: 8, category: 'behind', title: '假文影片標題 08', duration: '03:45' },
  { id: 9, category: 'craft', title: '假文影片標題 09', duration: '06:00' },
]

// 顯示在卡片上的分類英文
const categoryName = (key) => categories.find((c) => c.key === key).en

export default function FilmsView() {
  const [active, setActive] = useState('all')
  const visibleFilms = active === 'all' ? films : films.filter((film) => film.category === active)

  return (
    <main className={styles.page}>
      <PageIntro label="FILMS" title="影片">
        這裡是假文示意，之後會換成影片介紹。透過鏡頭，記錄一只包款從設計、選皮到完成的過程，以及工作室裡的日常。
      </PageIntro>

      <CategoryFilter value={active} onChange={setActive} categories={categories} label="影片分類" />

      {/* 影片格狀排列 */}
      <ul className={styles.grid}>
        {visibleFilms.map((film, index) => (
          <li key={film.id} className={styles.card}>
            <div className={styles.cardMedia}>
              <PhotoPlaceholder
                text="待影片檔"
                label={`影片 ${String(film.id).padStart(2, '0')}`}
                tone={index % 2 ? 'light' : 'dark'}
              />
              {/* 播放圖示 + 片長 */}
              <span className={styles.play} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13l10.5-6.5z" />
                </svg>
              </span>
              <span className={styles.duration} lang="en">
                {film.duration}
              </span>
            </div>
            <p className={styles.cardCategory} lang="en">
              {categoryName(film.category)}
            </p>
            <h2 className={styles.cardName}>{film.title}</h2>
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  )
}
