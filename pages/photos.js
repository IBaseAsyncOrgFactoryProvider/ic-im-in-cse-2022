/* eslint-disable jsx-a11y/alt-text, @next/next/no-img-element */

import Head from 'next/head'
import styles from '../styles/Photos.module.css'
import SectionTitle from '../components/SectionTitle'

export default function Photos() {
  return (
    <>
      <Head>
        <title>活動回顧 | 資想見你</title>
      </Head>
      <div className={styles['hero-container']}>
        <img src="/photos-hero-bg.jpg" />
        <div className={styles.hero}>
          <SectionTitle title="活動回顧" />
          <p>
            大學四年第一本回憶相冊<br />
            就在這裡建立吧！<br />
            將會乘載滿滿的回憶<br /><br />
            （活動結束後，照片才會上傳）
          </p>
        </div>
      </div>
    </>
  )
}
