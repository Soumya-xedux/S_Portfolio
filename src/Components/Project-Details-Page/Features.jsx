import styles from "./Features.module.css"

export const Features = ({ data }) => {
  if (!data?.length) return null;
  return (
    <section className={styles.features}>
      <h3 className={styles.featuresTitle}>Key Features</h3>
      <ul className={styles.featuresList}>
        {data?.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
    </section>
  );
};