import React, { useContext} from 'react'
import styles from './SideBar.module.css'
import { PortfolioContext } from '../../context/context'

export const SideBar = () => {
  const [selectedButton, setSelectedButton] = useContext(PortfolioContext);

  return (
    <div className={styles.sidebar}>
      <button
        className={`${styles.buttonGlow} ${selectedButton === 'about' ? styles.active : ''}`}
        onClick={() => setSelectedButton('about')}
      >
        About
      </button>

      <button
        className={`${styles.buttonGlow} ${selectedButton === 'projects' ? styles.active : ''}`}
        onClick={() => setSelectedButton('projects')}
      >
        Projects
      </button>

      <button
        className={`${styles.buttonGlow} ${selectedButton === 'experience' ? styles.active : ''}`}
        onClick={() => setSelectedButton('experience')}
      >
        Experience
      </button>

      <button
        className={`${styles.buttonGlow} ${selectedButton === 'education' ? styles.active : ''}`}
        onClick={() => setSelectedButton('education')}
      >
        Education
      </button>

      <button
        className={`${styles.buttonGlow} ${selectedButton === 'certifications' ? styles.active : ''}`}
        onClick={() => setSelectedButton('certifications')}
      >
        Certifications
      </button>

      <button
        className={`${styles.buttonGlow} ${selectedButton === 'skills' ? styles.active : ''}`}
        onClick={() => setSelectedButton('skills')}
      >
        Skills
      </button>
    </div>
  );
};
