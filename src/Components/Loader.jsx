import styles from "./Loader.module.css"
export const Loader = () => {
  return (
    <div className={styles.parent}>
      <div className={styles.loader}>
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className={styles.base}>
          <span></span>
          <div className={styles.face}></div>
        </div>
      </div>
      <div className={styles.longfazers}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
