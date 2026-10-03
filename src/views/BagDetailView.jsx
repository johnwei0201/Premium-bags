import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import BackButton from '../components/BackButton.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import BagCard from '../components/BagCard.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { bags, findBag, categoryOf, galleryOf, orBlank } from '../data/bags.js'
import styles from './BagDetailView.module.css'

// 包包個別頁：網址 /collection/3 → id 是 '3'
// 編號不存在（/collection/99、/collection/abc）→ 回到包款展示
// 每次網址換了都會重新檢查，所以從 /collection/3 直接換到 /collection/99 也擋得到
export default function BagDetailRoute() {
  const { id } = useParams()
  const bag = findBag(id)
  if (!bag) return <Navigate to="/collection" replace />
  return <BagDetailView bag={bag} />
}

// 大圖切換：舊的淡出 0.3 秒 → 換成新的 → 新的淡入（取代 Vue 的 <Transition mode="out-in">）
function useFadeSwap(target) {
  const [shown, setShown] = useState(target)
  const [fading, setFading] = useState(false)

  // 舊圖淡出，0.3 秒後換成新圖（這時還是透明的）
  useEffect(() => {
    // 淡出途中又點回原本那張：直接淡回來
    if (target.key === shown.key) {
      setFading(false)
      return
    }
    setFading(true)
    const timer = setTimeout(() => setShown(target), 300)
    return () => clearTimeout(timer)
  }, [target, shown.key])

  // 新圖放進畫面後：讓瀏覽器先記住「透明」的樣子，再淡入
  useLayoutEffect(() => {
    void document.body.offsetHeight
    setFading(false)
  }, [shown.key])

  return { shown, fading }
}

function BagDetailView({ bag }) {
  const category = categoryOf(bag.category)

  // 麵包屑：首頁 / COLLECTION / 分類（點了打開已篩選的列表）/ 這一款
  const crumbs = [
    { label: '首頁', to: '/' },
    { label: 'COLLECTION', to: '/collection', en: true },
    { label: category.en, to: `/collection?category=${bag.category}`, en: true },
    { label: bag.name },
  ]
  const number = String(bag.id).padStart(2, '0')

  // ---------- 照片：大圖 + 小圖，點小圖換大圖 ----------
  const gallery = galleryOf(bag)
  const [current, setCurrent] = useState(0)
  // 換到別款時，回到第一張
  const [currentBagId, setCurrentBagId] = useState(bag.id)
  if (currentBagId !== bag.id) {
    setCurrentBagId(bag.id)
    setCurrent(0)
  }

  // 要顯示的大圖（key 變了才算換圖）
  const targetKey = `${bag.id}-${current}`
  const target = useMemo(
    () => ({ key: targetKey, src: gallery[current], alt: `${bag.name}，第 ${current + 1} 張照片` }),
    [targetKey], // 同一個 key 就是同一張圖，key 變了才重新算
  )
  const { shown, fading } = useFadeSwap(target)

  // ---------- 規格（沒填的顯示 ___） ----------
  const specs = [
    { label: '材質', value: orBlank(bag.material) },
    { label: '顏色', value: orBlank(bag.color) },
    { label: '尺寸', value: orBlank(bag.size) },
    { label: '五金', value: orBlank(bag.hardware) },
  ]

  // ---------- 上一款／下一款 ----------
  const index = bags.findIndex((b) => b.id === bag.id)
  const prevBag = bags[index - 1]
  const nextBag = bags[index + 1]

  // ---------- 其他包款：同分類優先，不夠再補其他款，共 3 款 ----------
  const others = bags.filter((b) => b.id !== bag.id)
  const related = [
    ...others.filter((b) => b.category === bag.category),
    ...others.filter((b) => b.category !== bag.category),
  ].slice(0, 3)

  return (
    <main className={styles.page}>
      <article className={styles.detail}>
        {/* 頂端：左邊「返回」按鈕，右邊麵包屑 */}
        <div className={styles.topbar}>
          <BackButton fallback="/collection" />
          <Breadcrumb items={crumbs} />
        </div>

        <div className={styles.detailGrid}>
          {/* 左：照片 */}
          <section className={styles.gallery} aria-label="包款照片">
            <div className={`${styles.galleryMain} ${fading ? styles.galleryMainFading : ''}`}>
              {gallery.length ? (
                <img key={shown.key} src={shown.src} alt={shown.alt} className={styles.galleryImg} />
              ) : (
                <PhotoPlaceholder label={bag.name} />
              )}
            </div>

            {gallery.length > 1 && (
              <div className={styles.thumbs}>
                {gallery.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
                    aria-label={`看第 ${i + 1} 張照片`}
                    aria-pressed={i === current}
                    onClick={() => setCurrent(i)}
                  >
                    <img src={photo} alt="" className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 右：文字資訊（桌機捲動時會停在畫面上） */}
          <section className={styles.info}>
            <p className={styles.infoCategory}>
              <span lang="en">{category.en}</span>・{category.zh}
            </p>
            <h1 className={styles.infoName}>{bag.name}</h1>
            <p className={styles.infoNumber} lang="en">
              NO. {number}
            </p>

            <p className={styles.infoText}>
              這裡是假文示意，之後會換成這一款的介紹。從選皮、裁切到手工縫製，每一道工序都由工作室親手完成，
              讓包款隨著使用留下屬於主人的痕跡，越用越有味道。
            </p>

            <dl className={styles.specs}>
              {specs.map((spec) => (
                <div key={spec.label} className={styles.spec}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>

            {/* 點標題展開 / 收合（details 是瀏覽器內建的展開元件，不用寫程式） */}
            <div className={styles.more}>
              <details className={styles.moreItem}>
                <summary>
                  <span>製作工藝</span>
                  <span className={styles.moreEn} lang="en">
                    CRAFTSMANSHIP
                  </span>
                </summary>
                <p>這裡是假文示意，之後會換成這一款的製作過程，例如使用的皮革、縫線方式與邊油處理。</p>
              </details>
              <details className={styles.moreItem}>
                <summary>
                  <span>保養方式</span>
                  <span className={styles.moreEn} lang="en">
                    CARE
                  </span>
                </summary>
                <p>這裡是假文示意，之後會換成保養建議，例如避免長時間日曬與潮濕、定期使用皮革保養油。</p>
              </details>
            </div>
          </section>
        </div>

        {/* 上一款 / 回列表 / 下一款 */}
        <nav className={styles.pager} aria-label="切換包款">
          {prevBag ? (
            <Link to={`/collection/${prevBag.id}`} className={styles.pagerLink}>
              <span aria-hidden="true">←</span> {prevBag.name}
            </Link>
          ) : (
            <span />
          )}

          <Link to="/collection" className={`${styles.pagerLink} ${styles.pagerBack}`} lang="en">
            BACK TO COLLECTION
          </Link>

          {nextBag ? (
            <Link to={`/collection/${nextBag.id}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
              {nextBag.name} <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      {/* 其他包款 */}
      <section className={styles.related} aria-labelledby="related-title">
        <p className={styles.relatedLabel} lang="en">
          YOU MAY ALSO LIKE
        </p>
        <h2 id="related-title" className={styles.relatedTitle}>
          其他包款
        </h2>
        <ul className={styles.relatedGrid}>
          {related.map((item, i) => (
            <li key={item.id}>
              <BagCard bag={item} tone={i % 2 ? 'light' : 'dark'} />
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  )
}
