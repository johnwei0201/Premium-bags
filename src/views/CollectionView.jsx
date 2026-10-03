import { useSearchParams } from 'react-router'
import PageIntro from '../components/PageIntro.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import BagCard from '../components/BagCard.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
// 包款資料放在共用檔案，個別頁面也會用到
import { bags, bagCategories } from '../data/bags.js'
import styles from './CollectionView.module.css'

const validKeys = bagCategories.map((c) => c.key)

// 包款展示：分類篩選 + 包款格狀排列（點卡片進入個別頁）
// 目前選的分類記在網址上（/collection?category=tote），好處：
//   1. 從個別頁按「返回」，回來時還是剛剛選的分類
//   2. 個別頁的麵包屑點「TOTE」，可以直接打開已篩選好的列表
export default function CollectionView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('category')
  const active = validKeys.includes(query) ? query : 'all'

  // 換分類：用 replace（不多一筆上一頁），preventScrollReset（不跳回頂端）
  function setActive(key) {
    setSearchParams(key === 'all' ? {} : { category: key }, { replace: true, preventScrollReset: true })
  }

  const visibleBags = active === 'all' ? bags : bags.filter((bag) => bag.category === active)

  return (
    <main className={styles.page}>
      <PageIntro label="COLLECTION" title="包款展示">
        這裡是假文示意，之後會換成系列介紹。每一只包款，都從一塊皮革開始，經過裁切、縫製與打磨，成為陪伴日常的作品。
      </PageIntro>

      <CategoryFilter value={active} onChange={setActive} categories={bagCategories} label="包款分類" />

      {/* 包款格狀排列 */}
      <ul className={styles.grid}>
        {visibleBags.map((bag, index) => (
          <li key={bag.id}>
            <BagCard bag={bag} tone={index % 2 ? 'light' : 'dark'} />
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  )
}
