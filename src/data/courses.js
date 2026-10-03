// 課程資料（課程列表、報名頁共用）

// 分類：平常顯示英文，滑鼠移上去換中文
export const courseCategories = [
  { key: 'all', en: 'ALL', zh: '全部' },
  { key: 'beginner', en: 'BEGINNER', zh: '入門' },
  { key: 'advanced', en: 'ADVANCED', zh: '進階' },
  { key: 'workshop', en: 'WORKSHOP', zh: '單堂體驗' },
  { key: 'private', en: 'PRIVATE', zh: '私人課程' },
]

// 每一堂課（先放假文，之後換成真的課程）
// seats：每班最多幾人，報名頁的「報名人數」最多只能選到這個數字
// 可以再加的欄位（沒填的會顯示「___」）：
//   startDate 開課日期（例如 '2026.10.18（六）'）、price 費用、place 上課地點
export const courses = [
  { id: 1, category: 'workshop', name: '假文課程名稱 01', duration: '3 小時・1 堂', size: '每班 6 人', seats: 6 },
  { id: 2, category: 'beginner', name: '假文課程名稱 02', duration: '12 小時・4 堂', size: '每班 6 人', seats: 6 },
  { id: 3, category: 'advanced', name: '假文課程名稱 03', duration: '24 小時・8 堂', size: '每班 4 人', seats: 4 },
  { id: 4, category: 'private', name: '假文課程名稱 04', duration: '時數依需求安排', size: '一對一', seats: 1 },
  { id: 5, category: 'workshop', name: '假文課程名稱 05', duration: '3 小時・1 堂', size: '每班 6 人', seats: 6 },
  { id: 6, category: 'beginner', name: '假文課程名稱 06', duration: '12 小時・4 堂', size: '每班 6 人', seats: 6 },
]

// 用網址上的編號找課程，找不到回傳 undefined
export const findCourse = (id) => courses.find((course) => course.id === Number(id))

// 沒填的欄位顯示「___」
export const orBlank = (value) => value ?? '___'

// 分類的英文、中文名稱
export const courseCategoryOf = (key) => courseCategories.find((c) => c.key === key)
