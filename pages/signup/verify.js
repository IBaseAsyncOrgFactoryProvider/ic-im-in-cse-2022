import styles from '../../styles/SignupVerifyPage.module.css'

export default function SignupVerifyPage() {
  return (
    <div className={styles.surface}>
      <div className={styles.container}>
        <h1>報名</h1>
        <p>報名前，請先使用學校信箱驗證身份。你會收到一封含有六位數驗證碼的信，填入網頁後即可繼續。</p>

      </div>
    </div>
  )
}
