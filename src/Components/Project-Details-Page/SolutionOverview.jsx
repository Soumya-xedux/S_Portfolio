import styles from "./SolutionOverview.module.css"

export const SolutionOverview = ({ text }) => {
  if (!text?.length) return null;
  return (
    <section className={styles.solution}>
      <h3 className={styles.solutionTitle}>Solution Overview</h3>
      <p>{text}</p>
    </section>
  );
};