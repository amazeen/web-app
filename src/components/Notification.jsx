import styles from './Notification.module.scss'

const Notification = ({className, children, onClose}) => {
  return (
    <div className={`notification ${styles.notification} ${className}`}>
      <button className="delete" onClick={onClose}></button>
      {children}
    </div>
  )
}

export default Notification
