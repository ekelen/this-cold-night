import styles from "../styles/Modal.module.css";

export default function Modal({ children, title, onClose }) {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {title && <h2>{title}</h2>}
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
