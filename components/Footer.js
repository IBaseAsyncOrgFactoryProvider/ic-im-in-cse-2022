/* eslint-disable @next/next/no-img-element */

import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles['outer-container']}>
      <div className={styles.container}>
        <h2>社群媒體</h2>
        <a href="https://www.instagram.com/yzu_ic.im.in.cse_2022" target="_blank" rel="noreferrer">
          <img src="/ig-glyph-black.svg" alt="Instagram" />
        </a>
      </div>
    </footer>
  )
}
