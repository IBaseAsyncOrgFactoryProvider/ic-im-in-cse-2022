import { useState } from 'react'
import formStyles from '../styles/Form.module.css'
import SignupInfo from './SignupInfo'
import SignupReminders from './SignupReminders'
import * as api from '../api'
import { SizeChart } from './SignupForm'

export default function ReviewForm({
  personalInfo,
  emergencyContactInfo,
  exitReviewMode,
  reloadSignupStatus,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  async function handleSubmit() {
    if (isSubmitting) return
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      const res = await api.signup({
        personalInfo,
        emergencyContactInfo,
      })
      if (res.success) {
        reloadSignupStatus()
      } else {
        throw new Error('invalid response')
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('無法送出報名資料，請再試一次。')
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2>確認你的報名資料</h2>
      <SignupInfo {...{ personalInfo, emergencyContactInfo }} />
      <br />
      <a href="#" onClick={exitReviewMode}>
        填錯了嗎？點選繼續修改
      </a>
      <br />
      <SizeChart />
      <SignupReminders />
      <p>
        送出報名資料即表示你同意遵守防疫規定，也暸解本次活動有可能因疫情而取消。
      </p>
      {errorMessage && (
        <div
          style={{
            color: 'var(--color-error)',
            marginBottom: '1rem',
          }}
        >
          {errorMessage}
        </div>
      )}
      <button
        className={formStyles['form-button']}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        送出報名資料
      </button>
    </div>
  )
}
