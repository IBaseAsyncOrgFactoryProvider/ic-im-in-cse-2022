import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getAuthenticationStatus } from '../../api'

export default function SignupRoutingPage() {
  const router = useRouter()
  const [shouldCheckAuthStatus, setShouldCheckAuthStatus] = useState(false)
  const [authenticatedEmail, setAuthenticatedEmail] = useState(null)

  useEffect(() => {
    let attempt = window.localStorage.getItem('lastAuthAttempt')
    attempt = Number(attempt)
    if (attempt && (Date.now() - attempt) / 1000 < 5 * 60) {
      router.replace('/signup/present-code')
    }
    setShouldCheckAuthStatus(true)
  }, [router])

  useEffect(() => {
    if (!shouldCheckAuthStatus) return
    async function checkStatus() {
      const res = await getAuthenticationStatus()
      if (!res) {
        router.replace('/signup/verify')
      }
      setAuthenticatedEmail(res.email)
    }
    checkStatus()
  }, [shouldCheckAuthStatus, router])
  return (
    <>
      <Head>
        <title>報名 | 資想見你</title>
      </Head>
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        {!authenticatedEmail && shouldCheckAuthStatus && '請稍候'}
        {authenticatedEmail && <>已以 {authenticatedEmail} 的身份登入</>}
        <noscript>
          線上報名必須使用 JavaScript，但你的瀏覽器似乎不支援。
        </noscript>
      </div>
    </>
  )
}
