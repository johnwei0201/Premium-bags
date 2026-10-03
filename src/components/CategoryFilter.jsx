import styles from './CategoryFilter.module.css'

// 分類篩選列（包款展示、影片、課程、最新消息共用）
// 平常顯示英文，滑鼠移上去換中文（跟導覽列同一套）
// categories：[{ key, en, zh }]；value：目前選到的分類 key；onChange：點分類時通知外面
export default function CategoryFilter({ categories, value = 'all', onChange, label = '分類' }) {
  return (
    <div className={styles.toolbar}>
      <nav className={styles.filters} aria-label={label}>
        {categories.map((category) => {
          const active = value === category.key
          return (
            <button
              key={category.key}
              type="button"
              className={`${styles.filter} ${active ? styles.filterActive : ''}`}
              aria-pressed={active}
              onClick={() => onChange(category.key)}
            >
              <span className={styles.filterEn} lang="en">
                {category.en}
              </span>
              <span className={styles.filterZh} aria-hidden="true">
                {category.zh}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
