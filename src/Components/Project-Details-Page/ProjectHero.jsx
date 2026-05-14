import styles from "./ProjectHero.module.css";
import { ProjectMetaCard } from "./ProjectMetaCard";
import { API_BASE } from "../../config/api";

const BASE = `${API_BASE}/uploads/`;

export const ProjectHero = ({ project }) => {
  return (
    <section className={styles.hero}>
      <img
        className={styles.heroImage}
        src={BASE + project.image}
        alt={project.title}
      />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{project.title}</h1>
        <p className={styles.heroDescription}>{project.description}</p>

        <div className={styles.heroButtons}>
          <a
            className={styles.liveLink}
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Demo
          </a>
          <a
            className={styles.githubLink}
            href={project.githubLink}
            tatarget="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
      <ProjectMetaCard project={project} />
    </section>
  );
};
