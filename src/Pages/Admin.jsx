import React, { useState } from "react";
import styles from "./Admin.module.css";

import { Sidebar } from "../Components/Admin-page/Sidebar";
import { AboutContainer } from "../Components/Admin-page/AboutSection/AboutContainer";
import { ProjectsAdmin } from "../Components/Admin-page/ProjectsSection/ProjectsAdmin";
import { ExperienceContainer } from "../Components/Admin-page/ExperienceSection/ExperienceContainer";
import { EducationAdmin } from "../Components/Admin-page/EducationSection/EducationAdmin";
import { CertificationsAdmin } from "../Components/Admin-page/CertificationSection/CertificationsAdmin";
import { SkillsAdmin } from "../Components/Admin-page/SkillSection/SkillsAdmin";

import { signOut } from "firebase/auth";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

const SECTION_COMPONENTS = {
  About: AboutContainer,
  Projects: ProjectsAdmin,
  Experience: ExperienceContainer,
  Education: EducationAdmin,
  Certifications: CertificationsAdmin,
  Skills: SkillsAdmin,
};

const Admin = () => {
  const [selectedSideBar, setSelectedSideBar] = useState("About");
  const ActiveComponent = SECTION_COMPONENTS[selectedSideBar];
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);

    localStorage.removeItem("admin-auth");

    navigate("/");
  };

  return (
    <div className={styles.page}>
      <Sidebar updateSelection={setSelectedSideBar}>
        <button onClick={handleLogout}>Logout</button>
      </Sidebar>

      <div className={styles.main}>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Admin;
