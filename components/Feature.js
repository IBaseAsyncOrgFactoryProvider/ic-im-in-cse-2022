import styles from '../styles/Feature.module.css'

export default function Feature({
  name,
  description,
  image,
  nameRotated = false,
  showImageInMobileLayout = false,
}) {
  return (
    <>
      <div className={styles.title}>
        <h3 className={nameRotated ? styles.rotated : null}>{name}</h3>
      </div>
      <div className={styles.description}>
        <p>
          { showImageInMobileLayout && <span className={styles['mobile-layout-only']}>{image}<br /></span> }
          {description}
        </p>
      </div>
      <div className={styles.image}>{image}</div>
    </>
  )
}
