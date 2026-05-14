import { useNavigate } from "react-router";
import styles from "./BackButton.module.css";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
      ← Back to Projects
    </button>
  );
};