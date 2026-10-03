import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import BackButton from '../components/BackButton.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { findCourse, courseCategoryOf, orBlank } from '../data/courses.js'
import styles from './CourseApplyView.module.css'

// 課程報名頁：網址 /courses/2/apply → id 是 '2'
// 編號不存在（/courses/99/apply）→ 回到課程列表
// key={id}：換到別堂課的報名頁時，整個頁面換新 → 表單清空、回到填寫畫面
export default function CourseApplyRoute() {
  const { id } = useParams()
  const course = findCourse(id)
  if (!course) return <Navigate to="/courses" replace />
  return <CourseApplyView key={id} course={course} />
}

// ---------- 表單 ----------
const timeOptions = ['平日白天', '平日晚上', '週末']
const experienceOptions = ['完全沒有', '做過一點', '有經驗']

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  time: '',
  people: 1,
  experience: '完全沒有',
  note: '',
  agree: false,
}

// 必填星號
const Req = () => (
  <span className={styles.req} aria-hidden="true">
    ＊
  </span>
)

function CourseApplyView({ course }) {
  const category = courseCategoryOf(course.category)

  // 麵包屑：首頁 / COURSES / 課程名稱 / 報名
  const crumbs = [
    { label: '首頁', to: '/' },
    { label: 'COURSES', to: '/courses', en: true },
    { label: course.name }, // 課程目前沒有個別頁，所以不做成連結
    { label: '報名' },
  ]

  // 左邊課程摘要（沒填的顯示 ___）
  const summary = [
    { label: '時數', value: course.duration },
    { label: '人數', value: course.size },
    { label: '費用', value: orBlank(course.price) },
    { label: '地點', value: orBlank(course.place) },
  ]

  const [form, setForm] = useState(emptyForm)
  // 改某一個欄位：其他欄位保持不變
  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))
  // 文字欄位離開時去掉前後空白（同 Vue 的 v-model.trim）
  const trimField = (name) => setForm((prev) => ({ ...prev, [name]: prev[name].trim() }))

  // 報名人數最多到這堂課的名額
  const peopleOptions = Array.from({ length: course.seats }, (_, i) => i + 1)

  // 送出後改成顯示「確認畫面」
  const [submitted, setSubmitted] = useState(false)

  // 欄位格式由瀏覽器檢查（required、type="email"、pattern）；全部通過才會進到這裡
  // ⚠️ 目前還沒有後端，資料不會真的送出去，只在畫面上顯示確認內容
  function onSubmit(event) {
    event.preventDefault()
    setForm((prev) => ({ ...prev, name: prev.name.trim(), phone: prev.phone.trim(), email: prev.email.trim(), note: prev.note.trim() }))
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 文字欄位共用的設定
  const textProps = (name) => ({
    name,
    value: form[name],
    onChange: (event) => setField(name, event.target.value),
    onBlur: () => trimField(name),
  })

  return (
    <main className={styles.page}>
      <div className={styles.applyPage}>
        <div className={styles.topbar}>
          <BackButton fallback="/courses" />
          <Breadcrumb items={crumbs} />
        </div>

        <div className={styles.applyGrid}>
          {/* 左：課程摘要（桌機捲動時停在畫面上） */}
          <aside className={styles.course} aria-label="報名的課程">
            <div className={styles.coursePhoto}>
              <PhotoPlaceholder label={`課程 ${String(course.id).padStart(2, '0')}`} />
            </div>
            <p className={styles.courseCategory}>
              <span lang="en">{category.en}</span>・{category.zh}
            </p>
            <h2 className={styles.courseName}>{course.name}</h2>
            <p className={styles.courseDate}>
              <span className={styles.courseDateLabel}>開課日期</span>
              <span>{orBlank(course.startDate)}</span>
            </p>
            <dl className={styles.courseInfo}>
              {summary.map((row) => (
                <div key={row.label} className={styles.courseInfoRow}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          {/* 右：報名表 / 送出後的確認畫面 */}
          <section className={styles.formArea}>
            <p className={styles.formLabel} lang="en">
              APPLICATION
            </p>
            <h1 className={styles.formTitle}>{submitted ? '報名資料確認' : '課程報名'}</h1>

            {!submitted ? (
              // ---------- 報名表 ----------
              <form className={styles.form} onSubmit={onSubmit}>
                <p className={styles.formHint}>
                  <Req />
                  為必填欄位
                </p>

                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>
                      姓名
                      <Req />
                    </span>
                    <input type="text" autoComplete="name" required {...textProps('name')} />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>
                      手機
                      <Req />
                    </span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      placeholder="0912345678"
                      pattern="09\d{8}"
                      title="請輸入 09 開頭的 10 位數手機號碼"
                      required
                      {...textProps('phone')}
                    />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    Email
                    <Req />
                  </span>
                  <input type="email" autoComplete="email" required {...textProps('email')} />
                </label>

                {/* 單選：用按鈕樣式的選項 */}
                <fieldset className={styles.field}>
                  <legend className={styles.fieldLabel}>
                    希望上課時段
                    <Req />
                  </legend>
                  <div className={styles.chips}>
                    {timeOptions.map((option) => (
                      <label key={option} className={styles.chip}>
                        <input
                          type="radio"
                          name="time"
                          value={option}
                          checked={form.time === option}
                          onChange={() => setField('time', option)}
                          required
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>
                      報名人數
                      <Req />
                    </span>
                    <select
                      name="people"
                      value={form.people}
                      onChange={(event) => setField('people', Number(event.target.value))}
                      required
                    >
                      {peopleOptions.map((n) => (
                        <option key={n} value={n}>
                          {n} 人
                        </option>
                      ))}
                    </select>
                  </label>

                  <fieldset className={styles.field}>
                    <legend className={styles.fieldLabel}>皮革經驗</legend>
                    <div className={styles.chips}>
                      {experienceOptions.map((option) => (
                        <label key={option} className={styles.chip}>
                          <input
                            type="radio"
                            name="experience"
                            value={option}
                            checked={form.experience === option}
                            onChange={() => setField('experience', option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>備註</span>
                  <textarea rows="3" placeholder="想做的作品、特殊需求等，可以先告訴我們" {...textProps('note')} />
                </label>

                <label className={styles.agree}>
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={(event) => setField('agree', event.target.checked)}
                    required
                  />
                  <span>
                    我同意工作室使用以上資料聯繫報名事宜
                    <Req />
                  </span>
                </label>

                <button type="submit" className={styles.submit}>
                  <span>送出報名</span>
                  <span className={styles.submitArrow} aria-hidden="true">
                    →
                  </span>
                </button>
              </form>
            ) : (
              // ---------- 送出後：確認畫面 ----------
              <div className={styles.done} role="status">
                <p className={styles.doneText}>以下是你填寫的報名資料：</p>

                <dl className={styles.doneList}>
                  {[
                    ['課程', course.name],
                    ['姓名', form.name],
                    ['手機', form.phone],
                    ['Email', form.email],
                    ['上課時段', form.time],
                    ['報名人數', `${form.people} 人`],
                    ['皮革經驗', form.experience],
                    ...(form.note ? [['備註', form.note]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className={styles.doneRow}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* 還沒有後端：誠實告訴使用者資料沒有送出 */}
                <p className={styles.doneNotice}>
                  線上報名系統建置中，這份資料尚未送出。請透過 Instagram 或 Facebook 私訊工作室完成報名。
                </p>

                <div className={styles.doneActions}>
                  <button type="button" className={`${styles.submit} ${styles.submitGhost}`} onClick={() => setSubmitted(false)}>
                    修改資料
                  </button>
                  <Link to="/courses" className={styles.submit}>
                    <span>回課程列表</span>
                    <span className={styles.submitArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
