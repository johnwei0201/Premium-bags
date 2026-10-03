import { Link } from 'react-router'
import styles from './Breadcrumb.module.css'

// 麵包屑：告訴使用者現在在哪裡，每一層都可以點回去（最後一層是目前這頁，不能點）
// items：[{ label: '首頁', to: '/' }, { label: 'COURSES', to: '/courses', en: true }, { label: '報名' }]
//   en: true 的是英文字
export default function Breadcrumb({ items }) {
  return (
    <nav className={styles.breadcrumb} aria-label="目前位置">
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const lang = item.en ? 'en' : undefined
          return (
            <li key={i} aria-current={isLast ? 'page' : undefined}>
              {item.to && !isLast ? (
                <Link to={item.to} lang={lang}>
                  {item.label}
                </Link>
              ) : (
                <span lang={lang}>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
