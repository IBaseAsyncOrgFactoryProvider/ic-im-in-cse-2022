import styles from '../styles/Feature.module.css'

export default function Feature({
  name,
  description,
  image,
  nameRotated = false,
}) {
  return (
    <>
      <div className={styles.title}>
        <h3 className={nameRotated ? styles.rotated : null}>{name}</h3>
      </div>
      <div className={styles.description}>
        <p>{description}</p>
      </div>
      <div className={styles.image}>{image}</div>
    </>
  )
}
