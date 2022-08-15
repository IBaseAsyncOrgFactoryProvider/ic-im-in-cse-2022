/* eslint-disable @next/next/no-img-element */
import * as api from '../api'
import { useState } from 'react'
import SignupReminders from './SignupReminders'
import styles from '../styles/SignupPage.module.css'
import formStyles from '../styles/Form.module.css'

export function SizeChart() {
  const sizeChart = [
    { name: 'XS', chest: 43, length: 64 },
    { name: 'S', chest: 46, length: 67 },
    { name: 'M', chest: 49, length: 70 },
    { name: 'L', chest: 52, length: 73 },
    { name: 'XL', chest: 55, length: 75 },
    { name: '2XL', chest: 58, length: 77 },
    { name: '3XL', chest: 61, length: 79 },
  ]

  return (
    <>
      <h3 style={{ marginTop: '0' }}>尺寸對照表</h3>
      <img src="/tee.png" alt="胸寬、衣長示意圖" />
      <table>
        <tbody>
          <tr>
            <td></td>
            {sizeChart.map((size) => (
              <td key={size.name}>{size.name}</td>
            ))}
          </tr>
          <tr>
            <td>胸寬</td>
            {sizeChart.map((size) => (
              <td key={size.name}>{size.chest}</td>
            ))}
          </tr>
          <tr>
            <td>衣長</td>
            {sizeChart.map((size) => (
              <td key={size.name}>{size.length}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <small>※ 單位：公分。誤差範圍：±2–2.5 公分</small>
      <br />
      <small>※ 特殊尺碼：2XL 加收 20 元，3XL 加收 40 元</small>
    </>
  )
}

export default function SignupForm({
  personalInfo,
  setPersonalInfo,
  emergencyContactInfo,
  setEmergencyContactInfo,
  enterReviewMode,
}) {
  const [isCheckingFormat, setIsCheckingFormat] = useState(false)
  const [formatErrorMessages, setFormatErrorMessages] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  function updatePersonalInfo(event) {
    setPersonalInfo((oldInfo) => {
      return {
        ...oldInfo,
        [event.target.name]: event.target.value,
      }
    })
  }

  function updateEmergencyContactInfo(event) {
    setEmergencyContactInfo((oldInfo) => {
      return {
        ...oldInfo,
        [event.target.name]: event.target.value,
      }
    })
  }

  async function handleSubmit() {
    setIsCheckingFormat(true)
    setErrorMessage(null)
    setFormatErrorMessages([])
    try {
      const res = await api.checkSignupInfoFormat({
        personalInfo,
        emergencyContactInfo,
      })
      if (res.success) {
        enterReviewMode()
      } else if (res.error === 'format_error') {
        const messages = res.data.issues.map((issue) => issue.message)
        setFormatErrorMessages(messages)
      } else {
        throw new Error('invalid response')
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('無法檢查表單內容格式，請稍後再試。')
    }
    setIsCheckingFormat(false)
  }

  function handleSubmitButtonClick() {
    const trim = (info) => {
      const newInfo = { ...info }
      for (const key in newInfo) {
        newInfo[key] = newInfo[key].trim()
      }
      return newInfo
    }
    setPersonalInfo(trim)
    setEmergencyContactInfo(trim)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
        return false
      }}
    >
      <div>
        <section>
          <h2>個人資料</h2>
          <div className={formStyles['form-item-group-side-by-side']}>
            <div className={formStyles['form-item']}>
              <label htmlFor="form-field-name">姓名</label>
              <input
                id="form-field-name"
                type="text"
                required
                className={formStyles['w-8']}
                name="name"
                value={personalInfo.name}
                onInput={updatePersonalInfo}
              />
            </div>
            <div className={formStyles['form-item']}>
              <label htmlFor="form-field-dept">系所</label>
              <input
                id="form-field-dept"
                type="text"
                required
                className={formStyles['w-8']}
                name="dept"
                value={personalInfo.dept}
                onInput={updatePersonalInfo}
              />
            </div>
          </div>
          <div className={formStyles['form-item']}>
            <label>生日</label>
            <div className={formStyles['form-item-inner-grouped']}>
              <div className={formStyles['form-item']}>
                <label htmlFor="form-field-dob-year">西元年</label>
                <input
                  id="form-field-dob-year"
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  className={formStyles['w-5']}
                  name="dobYear"
                  value={personalInfo.dobYear}
                  onInput={updatePersonalInfo}
                />
              </div>
              <div className={formStyles['form-item']}>
                <label htmlFor="form-field-dob-month">月</label>
                <input
                  id="form-field-dob-month"
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  className={formStyles['w-5']}
                  name="dobMonth"
                  value={personalInfo.dobMonth}
                  onInput={updatePersonalInfo}
                />
              </div>
              <div className={formStyles['form-item']}>
                <label htmlFor="form-field-dob-day">日</label>
                <input
                  id="form-field-dob-day"
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  className={formStyles['w-5']}
                  name="dobDay"
                  value={personalInfo.dobDay}
                  onInput={updatePersonalInfo}
                />
              </div>
            </div>
          </div>
          <div className={formStyles['form-item']}>
            <label htmlFor="form-field-phone">聯絡電話</label>
            <input
              id="form-field-phone"
              type="text"
              required
              inputMode="numeric"
              className={formStyles['w-10']}
              name="phone"
              value={personalInfo.phone}
              onInput={updatePersonalInfo}
            />
          </div>
          <div className={formStyles['form-item']}>
            <label>生理性別</label>
            <div
              className={`${formStyles['form-item-group-side-by-side']} ${formStyles.nowrap}`}
            >
              {[
                ['male', '男'],
                ['female', '女'],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    required
                    checked={personalInfo.sex === value}
                    name="sex"
                    value={value}
                    onChange={updatePersonalInfo}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className={formStyles['form-item']}>
            <label>飲食習慣</label>
            <div
              className={`${formStyles['form-item-group-side-by-side']} ${formStyles.nowrap}`}
            >
              {[
                ['meat', '葷'],
                ['vegetarian', '素'],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    required
                    checked={personalInfo.foodPref === value}
                    name="foodPref"
                    value={value}
                    onChange={updatePersonalInfo}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className={formStyles['form-item']}>
            <label>營服尺寸</label>
            <div className={formStyles['form-item-group-side-by-side']}>
              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    required
                    checked={personalInfo.teeSize === value}
                    name="teeSize"
                    value={value}
                    onChange={updatePersonalInfo}
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
          <SizeChart />
        </section>
        <br />
        <section>
          <h2>緊急聯絡人</h2>
          <div className={formStyles['form-item-group-side-by-side']}>
            <div className={formStyles['form-item']}>
              <label htmlFor="form-field-ec-name">姓名</label>
              <input
                id="form-field-ec-name"
                type="text"
                required
                className={formStyles['w-8']}
                name="name"
                value={emergencyContactInfo.name}
                onInput={updateEmergencyContactInfo}
              />
            </div>
            <div className={formStyles['form-item']}>
              <label htmlFor="form-field-ec-relation">關係</label>
              <input
                id="form-field-ec-relation"
                type="text"
                required
                className={formStyles['w-8']}
                name="relation"
                value={emergencyContactInfo.relation}
                onInput={updateEmergencyContactInfo}
              />
            </div>
          </div>
          <div className={formStyles['form-item']}>
            <label htmlFor="form-field-ec-phone">聯絡電話</label>
            <input
              id="form-field-ec-phone"
              type="text"
              required
              inputMode="numeric"
              className={formStyles['w-10']}
              name="phone"
              value={emergencyContactInfo.phone}
              onInput={updateEmergencyContactInfo}
            />
          </div>
        </section>
        <SignupReminders />
        {!!formatErrorMessages.length && (
          <div className={styles['error-list']}>
            修正表單中以下錯誤後才能繼續：
            <ul>
              {formatErrorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        <br />
        <button
          className={formStyles['form-button']}
          onClick={handleSubmitButtonClick}
          disabled={isCheckingFormat}
        >
          繼續
        </button>
      </div>
    </form>
  )
}
