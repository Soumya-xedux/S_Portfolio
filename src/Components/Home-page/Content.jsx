import React, { useContext, useEffect, useState } from "react";
import { getAllData } from "../../api/special";

import styles from "./Content.module.css";
import aboutStyles from "./Styles/About.module.css";
import projectStyles from "./Styles/Projects.module.css";
import experienceStyles from "./Styles/Experience.module.css";
import educationStyles from "./Styles/Education.module.css";
import {
  GraduationCap,
  Laptop,
  UserRound,
  CalendarDays,
  MapPin,
} from "lucide-react";

import certificationStyles from "./Styles/Certifications.module.css";
import skillStyles from "./Styles/Skills.module.css";

import experienceCardStyles from "./Styles/ExperienceCard.module.css";
import educationCardStyles from "./Styles/EducationCard.module.css";
import certificationCardStyles from "./Styles/CertificationCard.module.css";
import skillcardStyles from "./Styles/SkillsCard.module.css";

import { PortfolioContext } from "../../context/context.js";

// sub-components
import { CardView } from "./ProjectCardView.jsx";

const iconMap = {
  GraduationCap,
  Laptop,
  UserRound,
};

export const Content = () => {
  const [selectedButton] = useContext(PortfolioContext);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getAllData();
        setData(res);
      } catch (err) {
        console.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div>Loading...</div>;

  let displayData = data?.[selectedButton?.toLowerCase()] || [];

  if (!displayData) return <div>No data</div>;

  return (
    <div className={styles.container}>
      {selectedButton === "projects" && <Projects displayData={displayData} />}

      {selectedButton === "about" && <About {...displayData} />}

      {selectedButton === "experience" && <Experience data={displayData} />}

      {selectedButton === "education" && <Education data={displayData} />}

      {selectedButton === "certifications" && (
        <Certifications displayData={displayData} />
      )}

      {selectedButton === "skills" && <Skills displayData={displayData} />}
    </div>
  );
};

export const About = ({ name, bio, profile, location }) => {

  return (
    <div
      style={{
        backgroundImage: `url(${profile})`,
        backgroundSize: "100% 100%",
        border: "none",
        borderRadius: "17px",
        overflow: "hidden",
        backgroundRepeat: "no-repeat",
        padding: "20px",
        color: "white",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      }}
      className={aboutStyles.about}
    >
      {/* // Abouts */}
      <div className={aboutStyles.heading}>About</div>
      {/* Name */}
      <div className={aboutStyles.content}>
        <h1 className={aboutStyles.name}>Hi, I'm {name}</h1>
        <br />
        <p className={aboutStyles.bio}>{bio}</p>
        <br />
        <br />
        <br />
        <p className={aboutStyles.location}>Current Location: {location}</p>
      </div>
    </div>
  );
};

export const Projects = ({ displayData }) => {
  const [filter, setFilter] = React.useState("All");
  const [filteredData, setFilteredData] = React.useState(displayData);

  useEffect(() => {
    setFilteredData(displayData);
  }, [displayData]);

  const handleFilterClick = (filter) => {
    // Implement filter logic based on project status (completed, in progress, upcoming)

    setFilter(filter);
    if (filter === "All") {
      setFilteredData(displayData);
    } else {
      const filtered = displayData.filter(
        (project) => project.status === filter,
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className={projectStyles.projectsContainer}>
      <div className={projectStyles.heading}>Projects</div>
      {/* add toggle to see completed, in progress and upcoming projects */}
      <div className={projectStyles.filterContainer}>
        <button
          className={`${projectStyles.filterButton} ${
            filter === "All" ? projectStyles.active : ""
          }`}
          onClick={() => handleFilterClick("All")}
        >
          All
        </button>
        <button
          className={`${projectStyles.filterButton} ${
            filter === "Completed" ? projectStyles.active : ""
          }`}
          onClick={() => handleFilterClick("Completed")}
        >
          Completed
        </button>
        <button
          className={`${projectStyles.filterButton} ${
            filter === "In Progress" ? projectStyles.active : ""
          }`}
          onClick={() => handleFilterClick("In Progress")}
        >
          In Progress
        </button>
        <button
          className={`${projectStyles.filterButton} ${
            filter === "Upcoming" ? projectStyles.active : ""
          }`}
          onClick={() => handleFilterClick("Upcoming")}
        >
          Upcoming
        </button>
      </div>
      <div className={projectStyles.cardsContainer}>
        {filteredData.map((project) => (
          <CardView
            key={project.id}
            id={project.id}
            image={project.image}
            title={project.title}
            description={project.description}
            liveLink={project.liveLink}
            githubLink={project.githubLink}
          />
        ))}
      </div>
    </div>
  );
};

// Experiences
// Experiences
export const Experience = ({ data }) => {
  return (
    <div className={experienceStyles["experience-section"]}>
      {/* Header */}
      <div className={experienceStyles["experience-header"]}>
        <div className={experienceStyles["experience-title-icon"]}>💼</div>
        <h1>Experience</h1>
      </div>

      {/* Timeline */}
      <div className={experienceStyles["timeline"]}>
        {data.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            {...exp}
            glow={index % 2 === 0 ? "cyan" : "pink"}
          />
        ))}
      </div>
    </div>
  );
};

export const ExperienceCard = ({
  logo,
  company,
  role,
  duration,
  details,
  location,
  skills = [],
  glow = "cyan",
}) => {

  return (
    <div className={experienceCardStyles["timeline-item"]}>
      {/* Timeline Dot */}
      <div
        className={`${experienceCardStyles["timeline-dot"]} ${
          experienceCardStyles[`timeline-dot-${glow}`]
        }`}
      ></div>

      {/* Card */}
      <div
        className={`${experienceCardStyles["experience-card"]} ${
          experienceCardStyles[`experience-card-${glow}`]
        }`}
      >
        {/* Top Row */}
        <div className={experienceCardStyles["top-section"]}>
          {/* Logo */}
          <div className={experienceCardStyles["logo-container"]}>
            <img src={logo} alt={company} />
          </div>

          {/* Details */}
          <div className={experienceCardStyles["main-details"]}>
            {/* Company */}
            <div className={experienceCardStyles["company-name"]}>
              {company}
            </div>

            {/* Role Badge */}
            <div
              className={`${experienceCardStyles["role-badge"]} ${
                experienceCardStyles[`role-badge-${glow}`]
              }`}
            >
              {role}
            </div>

            {/* Meta */}
            <div className={experienceCardStyles["meta-details"]}>
              <span>📅 {duration}</span>

              {location && <span>📍 {location}</span>}
            </div>

            {/* Divider */}
            <div className={experienceCardStyles["divider"]}></div>

            {/* Details */}
            <div className={experienceCardStyles["description"]}>
              {Array.isArray(details) ? (
                details.map((point, index) => <p key={index}>• {point}</p>)
              ) : (
                <p>• {details}</p>
              )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className={experienceCardStyles["skills-container"]}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`${experienceCardStyles["skill-pill"]} ${
                      experienceCardStyles[`skill-pill-${glow}`]
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Educations
export function Education({ data }) {
  return (
    <div className={educationStyles["education-container"]}>
      {/* Header */}
      <div className={educationStyles["education-header"]}>
        <GraduationCap className={educationStyles["header-icon"]} size={42} />
        <h1>Education</h1>
      </div>

      {/* Timeline */}
      <div className={educationStyles["timeline"]}>
        {data.map((item) => {
          const Icon = iconMap[item.icon] || GraduationCap;

          const glow = item.glow || "cyan";

          return (
            <div className={educationStyles["timeline-item"]} key={item.id}>
              <div
                className={`${educationStyles["timeline-icon"]} ${
                  educationStyles[`timeline-icon-${glow}`]
                }`}
              >
                <Icon size={28} />
              </div>

              {/* Card */}
              <div
                className={`${educationStyles["education-card"]} ${educationStyles[`education-card-${item.glow}`]}`}
              >
                <h2>{item.title}</h2>

                <h3>{item.institute}</h3>

                <div className={educationStyles["education-info"]}>
                  <span>
                    <CalendarDays size={16} />
                    {item.duration}
                  </span>

                  <span>
                    <MapPin size={16} />
                    {item.location}
                  </span>
                </div>

                <div className={educationStyles["divider"]}></div>

                <div className={educationStyles["points"]}>
                  {item.points?.map((point, index) => (
                    <p key={index}>{point}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const EducationCard = ({ institute, degree, year }) => {
  return (
    <div className={educationCardStyles.educationCard}>
      <div className={educationCardStyles.logoImage}></div>
      <div className={educationCardStyles.details}>
        <div className={educationCardStyles.institutionName}>{institute}</div>
        <div className={educationCardStyles.degree}>{degree}</div>
        <div className={educationCardStyles.duration}>{year}</div>
      </div>
    </div>
  );
};

// Certificates
export const Certifications = ({ displayData }) => {
  return (
    <div className={certificationStyles["certifications-section"]}>
      <div className={certificationStyles.heading}>Certifications</div>
      <div className={certificationStyles.content}>
        {displayData.map((cert, index) => (
          <CertificationCard key={cert.id} displayData={cert} index={index} />
        ))}
      </div>
    </div>
  );
};
export const CertificationCard = ({ displayData, index }) => {

  const glow = index % 2 === 0 ? "cyan" : "pink";

  return (
    <div
      className={`${certificationCardStyles["certification-card"]} ${
        certificationCardStyles[`certification-card-${glow}`]
      }`}
    >
      {/* TOP */}

      <div className={certificationCardStyles["top-section"]}>
        {/* LOGO */}

        <div className={certificationCardStyles["logo-container"]}>
          <img
            src={
              displayData.logo
                ? displayData.logo
                : "https://placehold.co/120x120"
            }
            alt={displayData.issuer}
          />
        </div>

        {/* DETAILS */}

        <div className={certificationCardStyles["details"]}>
          <h3 className={certificationCardStyles["title"]}>
            {displayData.title}
          </h3>

          <p className={certificationCardStyles["issuer"]}>
            {displayData.issuer}
          </p>

          <div className={certificationCardStyles["meta"]}>
            {displayData.date && <span>📅 {displayData.date}</span>}

            {displayData.certificateId && (
              <span>🎖 {displayData.certificateId}</span>
            )}
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className={certificationCardStyles["actions"]}>
        <button
          className={certificationCardStyles["view-certificate-button"]}
          onClick={() => window.open(displayData.certificateLink, "_blank")}
        >
          View Certificate ↗
        </button>
      </div>
    </div>
  );
};

// Skills
export const Skills = ({ displayData }) => {
  const uniqueCategories = [...new Set(displayData.map((s) => s.category))];

  return (
    <div className={skillStyles["skills-section"]}>
      <div className={skillStyles.heading}>Skills</div>
      <div className={skillStyles.content}>
        {uniqueCategories.map((category) => {
          const logos = displayData
            .filter((skill) => skill.category === category)
            .map((skill) => skill.image);
          return (
            <SkillsCard key={category} category={category} logos={logos} />
          );
        })}
      </div>
    </div>
  );
};
export const SkillsCard = ({ category, logos }) => {
  return (
    <div className={skillcardStyles["skills-card"]}>
      <div className={skillcardStyles["category"]}>{category}</div>
      <div className={skillcardStyles["logos"]}>
        {logos.map((logo, index) => (
          <img
            className={skillcardStyles["logo"]}
            key={index}
            src={logo}
            alt={category}
          />
        ))}
      </div>
    </div>
  );
};
