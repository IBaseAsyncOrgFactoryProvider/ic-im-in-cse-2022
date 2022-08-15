import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as api from '../../api'
import ReviewForm from '../../components/ReviewForm'
import SignupForm, { SizeChart } from '../../components/SignupForm'
import SignupInfo from '../../components/SignupInfo'
import SignupReminders from '../../components/SignupReminders'
import styles from '../../styles/SignupPage.module.css'
import formStyles from '../../styles/Form.module.css'

const SignupPageState = {
  DeterminingRouting: 'DeterminingRouting',
  CheckingAuthenticationStatus: 'CheckingAuthenticationStatus',
  CheckingSignupStatus: 'CheckingSignupStatus',
  ShowingSignupForm: 'ShowingSignupForm',
  ShowingReviewForm: 'ShowingReviewForm',
  ShowingSignupInfo: 'ShowingSignupInfo',
}

export default function SignupPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState(SignupPageState.DeterminingRouting)
  const [authenticatedEmail, setAuthenticatedEmail] = useState(null)
  const [isDeletingSession, setIsDeletingSession] = useState(false)
  const [isCancelingSignup, setIsCancelingSignup] = useState(false)

  const initialPersonalInfo = {
    name: '',
    dept: '',
    dobYear: '',
    dobMonth: '',
    dobDay: '',
    phone: '',
    sex: '',
    foodPref: '',
    teeSize: '',
  }

  const initialEmergencyContactInfo = {
    name: '',
    relation: '',
    phone: '',
  }

  const [personalInfo, setPersonalInfo] = useState(initialPersonalInfo)

  const [emergencyContactInfo, setEmergencyContactInfo] = useState(initialEmergencyContactInfo)

  function deleteSession(e) {
    e.preventDefault()
    async function go() {
      setIsDeletingSession(true)
      await api.deleteSession()
      router.replace('/signup/verify')
    }
    if (!isDeletingSession) {
      go()
    }
    return false
  }

  async function enterReviewMode() {
    window.scrollTo(0, 0)
    setPageState(SignupPageState.ShowingReviewForm)
  }

  async function handleCancelSignup() {
    const answer = confirm('你，真的確定要取消報名本次活動嗎？QQ')
    if (!answer) return
    setIsCancelingSignup(true)
    try {
      await api.cancelSignup()
      setPersonalInfo(initialPersonalInfo)
      setEmergencyContactInfo(initialEmergencyContactInfo)
      alert('取消報名成功囉。')
    } catch (e) {
      console.error(e)
      alert('取消報名好像沒有成功欸，請再試一次')
    }
    setPageState(SignupPageState.CheckingSignupStatus)
    setIsCancelingSignup(false)
  }

  useEffect(() => {
    let attempt = window.localStorage.getItem('lastAuthAttempt')
    attempt = Number(attempt)
    if (attempt && (Date.now() - attempt) / 1000 < 5 * 60) {
      router.replace('/signup/present-code')
      return
    }
    setPageState(SignupPageState.CheckingAuthenticationStatus)
  }, [router])

  useEffect(() => {
    if (pageState !== SignupPageState.CheckingAuthenticationStatus) return
    async function checkStatus() {
      if (location.href.includes('localhost')) {
        setPageState(SignupPageState.CheckingSignupStatus)
        setAuthenticatedEmail('alice@mail.yzu.edu.tw')
        return
      }
      const res = await api.getAuthenticationStatus()
      if (!res) {
        router.replace('/signup/verify')
        return
      }
      setAuthenticatedEmail(res.email)
      setPageState(SignupPageState.CheckingSignupStatus)
    }
    checkStatus()
  }, [pageState, router])

  useEffect(() => {
    if (pageState !== SignupPageState.CheckingSignupStatus) return
    async function checkStatus() {
      const res = await api.getSignup()
      if (!res) {
        setPageState(SignupPageState.ShowingSignupForm)
        return
      }
      setPersonalInfo(res.personalInfo)
      setEmergencyContactInfo(res.emergencyContactInfo)
      setPageState(SignupPageState.ShowingSignupInfo)
    }
    checkStatus()
  }, [pageState])

  const title =
    pageState === SignupPageState.ShowingSignupInfo
      ? '你的報名詳細資訊'
      : '報名'

  return (
    <>
      <Head>
        <title>報名 | 資想見你</title>
      </Head>
      <div className={styles.surface}>
        <div className={styles.container}>
          <h1>{title}</h1>
          {[
            SignupPageState.CheckingSignupStatus,
            SignupPageState.ShowingSignupForm,
            SignupPageState.ShowingReviewForm,
            SignupPageState.ShowingSignupInfo,
          ].includes(pageState) && (
            <div className={styles.identity}>
              {pageState !== SignupPageState.ShowingSignupInfo && (
                <>
                  你正以 <code>{authenticatedEmail}</code> 的身份報名本次活動。
                </>
              )}

              {pageState === SignupPageState.ShowingSignupInfo && (
                <>
                  已以 <code>{authenticatedEmail}</code> 的身份登入。
                </>
              )}
              <br />
              <a href="#" onClick={deleteSession}>
                {pageState !== SignupPageState.ShowingSignupInfo &&
                  '不是你的學號嗎？點選重新驗證'}
                {pageState === SignupPageState.ShowingSignupInfo && '登出'}
              </a>
            </div>
          )}
          {[
            SignupPageState.CheckingAuthenticationStatus,
            SignupPageState.CheckingSignupStatus,
          ].includes(pageState) && (
            <div style={{ textAlign: 'center' }}>請稍候</div>
          )}
          {pageState === SignupPageState.ShowingSignupForm && (
            <SignupForm
              {...{
                personalInfo,
                setPersonalInfo,
                emergencyContactInfo,
                setEmergencyContactInfo,
                enterReviewMode,
              }}
            />
          )}
          {pageState === SignupPageState.ShowingReviewForm && (
            <ReviewForm
              {...{
                email: authenticatedEmail,
                personalInfo,
                emergencyContactInfo,
                exitReviewMode: () =>
                  setPageState(SignupPageState.ShowingSignupForm),
                reloadSignupStatus: () =>
                  setPageState(SignupPageState.CheckingSignupStatus),
              }}
            />
          )}
          {pageState === SignupPageState.ShowingSignupInfo && (
            <>
              <SignupInfo
                personalInfo={personalInfo}
                emergencyContactInfo={emergencyContactInfo}
              />
              <br />
              <SizeChart />
              <SignupReminders />
              <br />
              <button
                className={formStyles['form-button']}
                onClick={handleCancelSignup}
                disabled={isCancelingSignup}
              >
                取消報名
              </button>
            </>
          )}
          <noscript>
            線上報名必須使用 JavaScript，但你的瀏覽器似乎不支援。
          </noscript>
        </div>
      </div>
    </>
  )
}
