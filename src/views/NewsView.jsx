import { useState } from 'react'
import PageIntro from '../components/PageIntro.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import styles from './NewsView.module.css'

// 最新消息：開頭 + 分類篩選跟其他頁一樣，內容改成「一則一列」的雜誌式列表
const categories = [
  { key: 'all', en: 'ALL', zh: '全部' },
  { key: 'notice', en: 'NOTICE', zh: '公告' },
  { key: 'event', en: 'EVENT', zh: '活動' },
  { key: 'press', en: 'PRESS', zh: '媒體報導' },
]

// 消息資料（先放假文，日期由新到舊）
const posts = [
  { id: 1, category: 'event', date: '2026.09.20', title: '假文消息標題 01' },
  { id: 2, category: 'notice', date: '2026.09.05', title: '假文消息標題 02' },
  { id: 3, category: 'press', date: '2026.08.18', title: '假文消息標題 03' },
  { id: 4, category: 'event', date: '2026.08.02', title: '假文消息標題 04' },
  { id: 5, category: 'notice', date: '2026.07.15', title: '假文消息標題 05' },
  { id: 6, category: 'press', date: '2026.06.28', title: '假文消息標題 06' },
]

// 顯示在列表上的分類英文
const categoryName = (key) => categories.find((c) => c.key === key).en

export default function NewsView() {
  const [active, setActive] = useState('all')
  const visiblePosts = active === 'all' ? posts : posts.filter((post) => post.category === active)

  return (
    <main className={styles.page}>
      <PageIntro label="NEWS" title="最新消息">
        這裡是假文示意，之後會換成最新消息。工作室的活動、課程開班、新作品發表與媒體報導，都會在這裡第一時間告訴你。
      </PageIntro>

      <CategoryFilter value={active} onChange={setActive} categories={categories} label="消息分類" />

      {/* 消息列表：左邊照片、右邊文字 */}
      <ul className={styles.list}>
        {visiblePosts.map((post, index) => (
          <li key={post.id} className={styles.post}>
            <div className={styles.postPhoto}>
              <PhotoPlaceholder label={`消息 ${String(post.id).padStart(2, '0')}`} tone={index % 2 ? 'light' : 'dark'} />
            </div>

            <div className={styles.postBody}>
              <p className={styles.postMeta} lang="en">
                <time dateTime={post.date.replaceAll('.', '-')}>{post.date}</time>
                <span className={styles.postDot} aria-hidden="true">
                  ・
                </span>{' '}
                {categoryName(post.category)}
              </p>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postExcerpt}>
                這裡是假文示意，之後會換成消息摘要。簡短說明這則消息的重點，讓讀者一眼就知道發生了什麼事。
              </p>
            </div>
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  )
}
