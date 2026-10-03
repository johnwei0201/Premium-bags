// 包款資料（包款展示、包包個別頁共用）
import { bagPhotos, photoAt } from './photos.js'

// 分類：平常顯示英文，滑鼠移上去換中文
export const bagCategories = [
  { key: 'all', en: 'ALL', zh: '全部' },
  { key: 'tote', en: 'TOTE', zh: '托特包' },
  { key: 'shoulder', en: 'SHOULDER', zh: '肩背包' },
  { key: 'handbag', en: 'HANDBAG', zh: '手提包' },
  { key: 'small', en: 'SMALL LEATHER', zh: '小皮件' },
]

// 每一款包包（之後換成真的名稱、照片）
// 可以加的欄位（沒填的會先顯示「___」）：
//   material 材質、color 顏色、size 尺寸、hardware 五金
//   例如 { id: 1, ..., material: '小牛皮', color: '墨綠', size: '32 × 25 × 12 cm' }
export const bags = [
  { id: 1, category: 'tote', name: '包款 01' },
  { id: 2, category: 'shoulder', name: '包款 02' },
  { id: 3, category: 'handbag', name: '包款 03' },
  { id: 4, category: 'small', name: '包款 04' },
  { id: 5, category: 'tote', name: '包款 05' },
  { id: 6, category: 'shoulder', name: '包款 06' },
  { id: 7, category: 'handbag', name: '包款 07' },
  { id: 8, category: 'small', name: '包款 08' },
  { id: 9, category: 'tote', name: '包款 09' },
  { id: 10, category: 'shoulder', name: '包款 10' },
  { id: 11, category: 'handbag', name: '包款 11' },
  { id: 12, category: 'small', name: '包款 12' },
]

// 用網址上的編號找包包，找不到回傳 undefined
export const findBag = (id) => bags.find((bag) => bag.id === Number(id))

// 分類的英文、中文名稱
export const categoryOf = (key) => bagCategories.find((c) => c.key === key)

// 這一款的照片（第 1 款用第 1 張……輪流）；沒有照片時回傳 null
export const coverOf = (bag) => (bagPhotos.length ? photoAt(bag.id - 1) : null)

// 個別頁的照片組：主照片 + 接下來幾張（先借用其他照片示意，之後每款放自己的多角度照片）
export const galleryOf = (bag, count = 4) =>
  bagPhotos.length ? Array.from({ length: Math.min(count, bagPhotos.length) }, (_, i) => photoAt(bag.id - 1 + i)) : []

// 沒填的欄位顯示「___」
export const orBlank = (value) => value ?? '___'
