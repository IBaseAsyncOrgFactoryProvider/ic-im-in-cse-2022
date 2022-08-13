import ActiveLink from './ActiveLink.tsx'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  return (
        <div className={styles['outer-container']}>
            <div className={styles.container}>
                <div>Logo</div>
                <div className={styles.links}>
                  <ActiveLink activeClassName={styles.active} href="/">
                    <a>主頁</a>
                  </ActiveLink>
                  <ActiveLink activeClassName={styles.active} href="/signup" matchPrefix={true}>
                    <a>報名</a>
                  </ActiveLink>
                    <a href="#">活動照片</a>
                </div>
            </div>
        </div>
  )
}
