import { useState } from 'react'
import { Link } from 'react-router'
import PageIntro from '../components/PageIntro.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
// 課程資料放在共用檔案，報名頁也會用到
import { courses, courseCategories as categories, orBlank } from '../data/courses.js'
import styles from './CoursesView.module.css'

// 顯示在卡片上的分類英文
const categoryName = (key) => categories.find((c) => c.key === key).en

// 課程：版型跟包款展示一樣（開頭 + 分類篩選 + 格狀排列），卡片多了上課資訊和「報名」按鈕
export default function CoursesView() {
  const [active, setActive] = useState('all')
  const visibleCourses = active === 'all' ? courses : courses.filter((course) => course.category === active)

  return (
    <main className={styles.page}>
      <PageIntro label="COURSES" title="課程">
        這裡是假文示意，之後會換成課程介紹。從認識皮革、工具開始，一針一線親手完成屬於自己的作品，適合初學者與想精進技法的人。
      </PageIntro>

      <CategoryFilter value={active} onChange={setActive} categories={categories} label="課程分類" />

      {/* 課程格狀排列 */}
      <ul className={styles.grid}>
        {visibleCourses.map((course, index) => (
          <li key={course.id} className={styles.card}>
            <div className={styles.cardPhoto}>
              <PhotoPlaceholder label={`課程 ${String(course.id).padStart(2, '0')}`} tone={index % 2 ? 'light' : 'dark'} />
            </div>
            <p className={styles.cardCategory} lang="en">
              {categoryName(course.category)}
            </p>
            <h2 className={styles.cardName}>{course.name}</h2>
            <p className={styles.cardDate}>
              <span className={styles.cardDateLabel}>開課日期</span>
              <span>{orBlank(course.startDate)}</span>
            </p>

            {/* 上課資訊 */}
            <dl className={styles.cardInfo}>
              <div className={styles.cardInfoRow}>
                <dt>時數</dt>
                <dd>{course.duration}</dd>
              </div>
              <div className={styles.cardInfoRow}>
                <dt>人數</dt>
                <dd>{course.size}</dd>
              </div>
            </dl>

            {/* 報名：進入這堂課的報名頁 */}
            <Link to={`/courses/${course.id}/apply`} className={styles.apply} aria-label={`報名${course.name}`}>
              <span>報名</span>
              <span className={styles.applyArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  )
}
