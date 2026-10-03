import { Link } from 'react-router'
import { bags, coverOf } from '../data/bags.js'
import styles from './SplitSection.module.css'

// 第 2 屏左邊放第 1 款、右邊第 2 款，第 3 屏左邊第 3 款……包款用完再從第 1 款輪一次
const bagAt = (slot) => bags[slot % bags.length]

// 左右對半的一屏（精選展示屏），number 是第幾屏
// 每一格先決定「放哪一款包」，照片用那一款的封面照，點下去進入那一款的個別頁
// → 照片和連結永遠是同一款，不會對不上
export default function SplitSection({ number }) {
  const leftBag = bagAt((number - 2) * 2)
  const rightBag = bagAt((number - 2) * 2 + 1)

  return (
    <section className={`screen ${styles.split}`}>
      {[leftBag, rightBag].map((bag) => (
        <Link key={bag.id} to={`/collection/${bag.id}`} className={styles.splitLink} aria-label={`看${bag.name}`}>
          <img src={coverOf(bag)} alt={bag.name} className={styles.splitImg} loading="lazy" />
        </Link>
      ))}
    </section>
  )
}
