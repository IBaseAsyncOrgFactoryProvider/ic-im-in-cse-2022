import styles from '../styles/SectionTitle.module.css'

export default function SectionTitle({
  title,
}) {
  return (
    <div className={styles.container}>
        <h2 className={styles['section-title']}>{title}</h2>
    </div>
  )
}
