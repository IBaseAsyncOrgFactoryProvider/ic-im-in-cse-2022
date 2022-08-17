import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../styles/SignupVerifyPage.module.css'
import formStyles from '../../styles/Form.module.css'

const RecaptchaSiteKey = '6LfodHEhAAAAAPrJ_yP11JhD8knNjz-m9AFJd_k4'
const EmailSuffix = '@mail.yzu.edu.tw'

export default function SignupVerifyPage() {
  const [localPart, setLocalPart] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let attempt = window.localStorage.getItem('lastAuthAttempt')
    attempt = Number(attempt)
    if (attempt && (Date.now() - attempt) / 1000 < 5 * 60) {
      router.replace('/signup/present-code')
    }
  }, [router])

  function recaptchaReady() {
    return new Promise((resolve, reject) => {
      if (
        window.grecaptcha &&
        window.grecaptcha.ready &&
        typeof window.grecaptcha.ready === 'function'
      ) {
        window.grecaptcha.ready(() => resolve())
      } else {
        reject(new Error('recaptcha is not ready'))
      }
    })
  }

  async function sendVerificationCode() {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await recaptchaReady()
      const token = await window.grecaptcha.execute(RecaptchaSiteKey, {
        action: 'send_verification_code',
      })
      const email = localPart.trim() + EmailSuffix
      const res = await fetch('/api/verification-code', {
        method: 'POST',
        headers: {
          'X-No-CSRF': 'yes',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          recaptchaChallenge: token,
          email,
        }),
      })
      const j = await res.json()
      if (j && j.error === 'ratelimit') {
        setErrorMessage('驗證信要求次數太過頻繁，請稍後再試。')
      } else if (!j.success) {
        throw new Error('did not success?')
      } else {
        window.localStorage.setItem('lastAuthAttempt', Date.now())
        window.localStorage.setItem('lastAuthAttemptEmail', email)
        router.replace('/signup/present-code')
        return
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('無法傳送驗證信，請稍後再試。')
    }
    setIsSubmitting(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isSubmitting) {
      sendVerificationCode()
    }
    return false
  }

  return (
    <div className={styles.surface}>
      <Head>
        <title>報名 | 資想見你</title>
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${RecaptchaSiteKey}`}
          async={true}
        ></script>
      </Head>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .grecaptcha-badge {
            display: block !important;
          }
          `,
        }}
      />
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1>報名</h1>
        <p>報名前，請先使用學校信箱驗證身份。</p>
        <br />
        <div className={formStyles['form-item']} style={{ display: 'inline-flex' }}>
          <label htmlFor="email-local-part">你的學校信箱</label>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              id="email-local-part"
              className={`${formStyles['w-10']} ${formStyles['align-right']}`}
              required={true}
              spellCheck={false}
              autoComplete="off"
              autoFocus={true}
              value={localPart}
              onInput={(e) => setLocalPart(e.target.value)}
            />
            <span className={styles['email-suffix']}>{EmailSuffix}</span>
          </div>
        </div>
        <details>
          <summary>
            <span>不知道你的學校信箱嗎？</span>
          </summary>
          <p>
            你用來登入 Portal 的帳號，就是你信箱的前半部分。
            <br />
            所以如果你的帳號是 s1119876，完整的信箱就是 s1119876@mail.yzu.edu.tw
            喔！
          </p>
        </details>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        <button
          className={formStyles['form-button']}
          type="submit"
          disabled={isSubmitting}
        >
          繼續
        </button>
        <p style={{ fontSize: '0.9rem' }}>報名只開放到 8/28 中午 12:00，請把握時間！</p>
      </form>
    </div>
  )
}
