import styles from '../styles/Feature.module.css'

export default function Feature({
  name, description, image, withFilledBackground = false, nameRotated = false,
}) {
  let containerClasses = styles['outer-container']
  if (withFilledBackground) containerClasses += ' ' + styles['filled-bg']
  return (
        <div className={containerClasses}>
          <div className={styles.container}>
              <h3 className={nameRotated ? styles.rotated : ''}>{name}</h3>
              <p>{description}</p>
              <div>{image}</div>
          </div>
        </div>
  )
}
