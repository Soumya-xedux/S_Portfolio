import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { getSection } from "../api/crud"; // 👈 use your API

import { BackButton } from "../Components/Project-Details-Page/BackButton";
import { ProjectHero } from "../Components/Project-Details-Page/ProjectHero";
import { TechStack } from "../Components/Project-Details-Page/TechStack";
import { ProblemStatement } from "../Components/Project-Details-Page/ProblemStatement";
import { SolutionOverview } from "../Components/Project-Details-Page/SolutionOverview";
import { Features } from "../Components/Project-Details-Page/Features";
import { Challenges } from "../Components/Project-Details-Page/Challenges";
import { FooterNote } from "../Components/Project-Details-Page/FooterNote";
import { Loader } from "../Components/Loader";
import styles from "./ProjectDetailsPage.module.css";

const ProjectDetailsPage = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projects = await getSection("projects");
        const found = projects.find((p) => String(p.id) === id);//add String() -> if DB id is number then it will not work without String()
        setProject(found);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Loader />;

  if (!project) return <div>Project not found</div>;

  return (
    <div className={styles.page}>
      <BackButton />

      <div className={styles.heroRow}>
        <ProjectHero project={project} />
      </div>

      <div className={styles.grid}>
        <TechStack tech={project.tech} />
        <ProblemStatement text={project.details?.problemStatement} />
        <SolutionOverview text={project.details?.solution} />
        <Features data={project.details?.features || []} />
      </div>

      <Challenges data={project.details?.challenges || []} />

      <FooterNote />
    </div>
  );
};

export default ProjectDetailsPage;