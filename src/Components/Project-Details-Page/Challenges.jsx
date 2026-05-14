import styles from "./Challenges.module.css"

export const Challenges = ({ data }) => {
  if (!data?.length) return null;
  return (
    <div className={styles.challenges}>
      <h3 className={styles.challengesTitle }>Challenges & Solutions</h3>

      <div className={styles.challengesGrid}>
        {data?.map((c, i) => (
          <div key={i} className={styles.challengeCard}>
            <p><b className={styles.challengeText}>Challenge:</b> {c.problem}</p>
            <p><b className={styles.solutionText}>Solution:</b> {c.solution}</p>
          </div>
        ))}
      </div>
    </div>
  );
};