import styles from "./ProjectMetaCard.module.css"


export const ProjectMetaCard = ({ project }) => {
  return (
    <section className={styles.metaCard}>
      <p className={styles.metaRow}><b>Project ID:</b> {project.id}</p>
      <p className={styles.metaRow}><b>Status:</b> {project.status}</p>
      <p className={styles.metaRow}><b>Tech:</b> {project.tech?.length || 0}</p>
      <p className={styles.metaRow}><b>Category:</b> {project.category || "Web Application"}</p>
    </section>
  );
};