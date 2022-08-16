import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../styles/PresentCodePage.module.css'
import formStyles from '../../styles/Form.module.css'
import Link from 'next/link'
import * as api from '../../api'
import Head from 'next/head'

export default function PresentCodePage() {
  const router = useRouter()
  const [email, setEmail] = useState(null)
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const email = window.localStorage.getItem('lastAuthAttemptEmail')
    setEmail(email)
    if (!email) {
      router.replace('/signup')
      return
    }
    function checkState() {
      const attempt = Number(window.localStorage.getItem('lastAuthAttempt'))
      if (attempt && (Date.now() - attempt) / 1000 >= 5 * 60) {
        router.replace('/signup/verify')
      }
    }
    const h = setInterval(checkState, 2000)

    return () => {
      clearInterval(h)
    }
  }, [router])

  function clearAuthAttempt() {
    window.localStorage.removeItem('lastAuthAttempt')
    window.localStorage.removeItem('lastAuthAttemptEmail')
  }

  async function presentCode() {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const result = await api.presentCode(email, code)
      if (result === api.PresentCodeResult.Success) {
        clearAuthAttempt()
        router.replace('/signup')
      } else if (result === api.PresentCodeResult.Failed) {
        setErrorMessage('驗證碼不正確。')
      } else if (result === api.PresentCodeResult.RateLimited) {
        setErrorMessage('驗證太過頻繁，請稍後再試。')
      } else if (result === api.PresentCodeResult.GenericError) {
        throw new Error(api.PresentCodeResult.GenericError.toString())
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('無法送出驗證碼，請再試一次。')
    }
    setIsSubmitting(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isSubmitting) {
      presentCode()
    }
    return false
  }

  return (
    <div className={styles.surface}>
      <Head>
        <title>驗證 | 資想見你</title>
      </Head>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1>輸入驗證碼</h1>
        <div className={formStyles['form-item']} style={{ display: 'inline-flex' }}>
          <label htmlFor="code-input">驗證碼</label>
          <br />
          <input
            id="code-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            autoFocus
            className={formStyles['w-8']}
            value={code}
            onInput={(e) => {
              setCode((e.target as HTMLInputElement).value)
            }}
          />
        </div>
        <p>
          我們已寄送一封含有六位數驗證碼的電子郵件到 <code>{email}</code>。
          <br />
          如果一直沒有收到驗證信，請檢查是否被歸類為垃圾郵件。
        </p>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        <button type="submit" className={formStyles['form-button']} disabled={isSubmitting}>
          確認
        </button>
        <br />
        <br />
        <br />
        <Link href="/signup/verify">
          <a onClick={clearAuthAttempt}>打錯電子郵件了嗎？</a>
        </Link>
      </form>
    </div>
  )
}
