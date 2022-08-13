import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function SignupRoutingPage() {
  const router = useRouter()
  useEffect(() => {
    router.push('/signup/verify')
  }, [router])

  return (
    <>
      <Head>
        <title>報名 | 資想見你</title>
      </Head>
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <noscript>
          線上報名必須使用 JavaScript，但你的瀏覽器似乎不支援。
        </noscript>
      </div>
    </>
  )
}
