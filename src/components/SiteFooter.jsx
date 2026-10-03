import styles from './SiteFooter.module.css'

// 頁尾：3 欄，每欄 2 個連結（先放假文）
const columns = [
  ['條款假文', '隱私假文'],
  ['保養假文', '關於假文'],
  ['社群假文', '語言假文'],
]

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerColumns}>
        {columns.map((column, index) => (
          <ul key={index} className={styles.footerColumn}>
            {column.map((text) => (
              <li key={text}>
                <a href="#" className={styles.footerLink}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <p className={styles.copyright}>© 2026 版權假文，保留所有權利。</p>
    </footer>
  )
}
