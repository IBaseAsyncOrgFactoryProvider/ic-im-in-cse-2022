import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  return (
        <div className={styles['outer-container']}>
            <div className={styles.container}>
                <div>Logo</div>
                <div className={styles.links}>
                    <a href="#" className={styles.active}>主頁</a>
                    <a href="#">報名</a>
                    <a href="#">活動照片</a>
                </div>
            </div>
        </div>
  )
}
