import { createBrowserRouter } from 'react-router'
import App from './App.jsx'
import HomeView from './views/HomeView.jsx'
import CollectionView from './views/CollectionView.jsx'
import BagDetailView from './views/BagDetailView.jsx'
import FilmsView from './views/FilmsView.jsx'
import CoursesView from './views/CoursesView.jsx'
import CourseApplyView from './views/CourseApplyView.jsx'
import NewsView from './views/NewsView.jsx'

// 網址對應的頁面（App 是外框：導覽列 + 會員彈窗，中間放各頁）
// 編號不存在的檢查寫在各頁裡面（BagDetailView、CourseApplyView），每次網址換了都會重新檢查
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomeView /> },
      { path: '/collection', element: <CollectionView /> }, // 包款展示
      { path: '/collection/:id', element: <BagDetailView /> }, // 包包個別頁：/collection/1、/collection/2……
      { path: '/films', element: <FilmsView /> }, // 影片
      { path: '/courses', element: <CoursesView /> }, // 課程
      { path: '/courses/:id/apply', element: <CourseApplyView /> }, // 課程報名
      { path: '/news', element: <NewsView /> }, // 最新消息
    ],
  },
])

export default router
