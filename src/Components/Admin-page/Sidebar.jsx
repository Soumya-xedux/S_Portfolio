import styles from "./SideBar.module.css";
import { useState } from "react";

export const Sidebar = ({ updateSelection, children }) => {
  const [activeButton, setActiveButton] = useState("About");
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Admin Panel</h2>

      {[
        "About",
        "Projects",
        "Experience",
        "Education",
        "Certifications",
        "Skills",
        "Contacts",
      ].map((item) => (
        <div
          key={item}
          className={`${styles.item} ${item === activeButton ? styles.active : ""}`}
        >
          <button
            onClick={() => {
              updateSelection(item);
              setActiveButton(item);
            }}
            className={styles.buttons}
          >
            {item}
          </button>
        </div>
      ))}
      <div className={styles.logout}>
        {children}
      </div>
    </div>
  );
};
