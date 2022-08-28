import Head from 'next/head'
import SignupReminders from '../../components/SignupReminders'
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
          <p>
            報名已經截止囉！有任何問題都歡迎私訊我們的{' '}
            <a
              href="https://www.instagram.com/yzu_ic.im.in.cse_2022"
              target="_blank"
              rel="noreferrer"
            >
              IG 帳號
            </a>
            ！
          </p>
          以下幾點再次提醒～
          <SignupReminders />
        </div>
      </div>
    </>
  )
}
