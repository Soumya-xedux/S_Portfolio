import styles from "./TechStack.module.css"

export const TechStack = ({ tech }) => {
  if (!tech?.length) return null;
  return (
    <section className={styles.techStack}>
      <h3 className={styles.techStackTitle }>Tech Stack</h3>
      <div className={styles.techStackList}>
        {tech?.map((t, i) => (
          <span key={i} className={styles.techStackItem}>{t}</span>
        ))}
      </div>
    </section>
  );
};