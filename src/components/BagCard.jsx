import { Link } from 'react-router'
import PhotoPlaceholder from './PhotoPlaceholder.jsx'
import { categoryOf, coverOf, orBlank } from '../data/bags.js'
import styles from './BagCard.module.css'

// 包款卡片：點整張卡片（照片或文字）進入這一款的個別頁面
// 包款展示、個別頁下方的「其他包款」共用
// tone：沒照片時佔位框的底色
export default function BagCard({ bag, tone = 'dark' }) {
  const cover = coverOf(bag)

  return (
    <Link to={`/collection/${bag.id}`} className={styles.card}>
      <div className={styles.cardPhoto}>
        {cover ? (
          <img src={cover} alt={bag.name} className={styles.cardImg} loading="lazy" />
        ) : (
          <PhotoPlaceholder label={bag.name} tone={tone} />
        )}
      </div>
      <p className={styles.cardCategory} lang="en">
        {categoryOf(bag.category).en}
      </p>
      <h2 className={styles.cardName}>{bag.name}</h2>
      <p className={styles.cardDetail}>
        <span>材質：{orBlank(bag.material)}</span>
        <span>顏色：{orBlank(bag.color)}</span>
      </p>
    </Link>
  )
}
