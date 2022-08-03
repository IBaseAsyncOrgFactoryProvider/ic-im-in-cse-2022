import styles from '../styles/Feature.module.css'

export default function Feature({
  name, description, image, reversed = false, nameRotated = false,
}) {
  let containerClasses = styles.container
  if (reversed) containerClasses += ' ' + styles.reversed
  return (
        <div className={containerClasses}>
            <h3 className={nameRotated ? styles.rotated : ''}>{name}</h3>
            <p>{description}</p>
            <div>{image}</div>
        </div>
  )
}
