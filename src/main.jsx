import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

// 全站 CSS：先 reset 清掉瀏覽器預設樣式 → 色彩與字體變數 → 全站設定
import './assets/css/reset.css'
import './assets/css/variables.css'
import './assets/css/base.css'

import router from './router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
