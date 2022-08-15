import styles from '../styles/SignupInfo.module.css'

export default function SignupInfo({ personalInfo, emergencyContactInfo }) {
  const dob = `${Number(personalInfo.dobYear)}/${Number(
    personalInfo.dobMonth,
  )}/${Number(personalInfo.dobDay)}`
  const sex =
    personalInfo.sex === 'male'
      ? '男'
      : personalInfo.sex === 'female'
        ? '女'
        : personalInfo.sex
  const foodPref =
    personalInfo.foodPref === 'meat'
      ? '葷'
      : personalInfo.foodPref === 'vegetarian'
        ? '素'
        : personalInfo.foodPref

  return (
    <div className={styles.info}>
      <h3>個人資料</h3>
      <div className={styles.dataRow}>
        <div className={styles.title}>姓名</div>
        <div className={styles.value}>{personalInfo.name}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>系所</div>
        <div className={styles.value}>{personalInfo.dept}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>生日</div>
        <div className={styles.value}>{dob}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>聯絡電話</div>
        <div className={styles.value}>{personalInfo.phone}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>生理性別</div>
        <div className={styles.value}>{sex}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>飲食習慣</div>
        <div className={styles.value}>{foodPref}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>營服尺寸</div>
        <div className={styles.value}>{personalInfo.teeSize}</div>
      </div>

      <h3>緊急聯絡人資料</h3>
      <div className={styles.dataRow}>
        <div className={styles.title}>姓名</div>
        <div className={styles.value}>{emergencyContactInfo.name}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>關係</div>
        <div className={styles.value}>{emergencyContactInfo.relation}</div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.title}>聯絡電話</div>
        <div className={styles.value}>{emergencyContactInfo.phone}</div>
      </div>
    </div>
  )
}
