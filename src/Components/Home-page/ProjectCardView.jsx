import React, { useState } from "react";
import styles from "./Styles/ProjectCardView.module.css";
import { useNavigate } from "react-router";
import { Loader } from "../Loader.jsx"
export const CardView = ({
  id,
  image,
  title,
  description,
  liveLink,
  githubLink,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCardClick = (e) => {
    e.stopPropagation();

    setLoading(true); // 👈 start loader

    setTimeout(() => {
      navigate(`/projects/${id}`);
    }, 1000); // small delay for UX
  };
  console.log("description : ", description);
  return (
    <>
      {loading && <Loader/>}

      <div className={styles.card} key={id} onClick={handleCardClick}>
        <img src={image} alt={title} className={styles.cardImage} />
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.techStack}>
          {/* Tech stack tags can be added here */}
        </div>
        <div className={styles.links}>
          {/* Live and GitHub links can be added here */}
          <button
            className={styles.liveButton}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              window.open(liveLink, "_blank");
            }}
          >
            Live Demo
          </button>
          <button
            className={styles.githubButton}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              window.open(githubLink, "_blank");
            }}
          >
            GitHub Repo
          </button>
        </div>
      </div>
    </>
  );
};
