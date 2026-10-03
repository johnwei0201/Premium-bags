import styles from './PhotoPlaceholder.module.css'

// 照片佔位框：之後拿到照片，把這個元件換成 <img> 就好
// label：小編號，方便辨認是哪一張
// tone：dark / light 兩種底色，讓相鄰的框分得出來
// text：影片頁改成「待影片檔」
export default function PhotoPlaceholder({ label = '', tone = 'dark', text = '待照片檔' }) {
  return (
    <div className={`${styles.placeholder} ${tone === 'light' ? styles.placeholderLight : styles.placeholderDark}`}>
      <p className={styles.placeholderText}>{text}</p>
      {label && <p className={styles.placeholderLabel}>{label}</p>}
    </div>
  )
}
