import Head from 'next/head'
import styles from '../../styles/SignupPage.module.css'

export default function SignupPage() {
  return (
    <>
      <Head>
        <title>報名 | 資想見你</title>
      </Head>
      <div className={styles.surface}>
        <div className={styles.container}>
          <h1>報名</h1>
          <div style={{ textAlign: 'center' }}>報名已經截止囉！有問題請私訊我們的 IG 帳號！</div>
        </div>
      </div>
    </>
  )
}
