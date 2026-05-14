import styles from "./ProblemStatement.module.css"

export const ProblemStatement = ({ text }) => {
  return (
    <section className={styles.problem}>
      <h3 className={styles.problemTitle}> ⚠ Problem Statement</h3>
      <p className={styles.problemText}>{text}</p>
    </section>
  );
};