/* eslint-disable @next/next/no-img-element */
import ActiveLink from './ActiveLink.tsx'
import styles from '../styles/Navbar.module.css'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [isDev, setIsDev] = useState(false)
  useEffect(() => {
    if (location.hostname.startsWith('dev.') || location.href.includes('localhost')) {
      setIsDev(true)
    }
  }, [])

  return (
        <div className={styles['outer-container']}>
            <div className={styles.container}>
                <img alt="Logo" src="/logo.png"/>
                <div className={styles.links}>
                  {!isDev && <ActiveLink activeClassName={styles.active} href="/">
                    <a>主頁</a>
                  </ActiveLink>}
                  {isDev && <ActiveLink activeClassName={styles.active} href="/">
                    <a><marquee>測試主頁</marquee></a>
                  </ActiveLink>}
                  <ActiveLink activeClassName={styles.active} href="/signup" matchPrefix={true}>
                    <a>報名</a>
                  </ActiveLink>
                  <ActiveLink activeClassName={styles.active} href="/photos">
                    <a>活動回顧</a>
                  </ActiveLink>
                </div>
            </div>
        </div>
  )
}
