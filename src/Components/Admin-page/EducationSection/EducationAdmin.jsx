import React, { useState, useEffect } from "react";
import styles from "./EducationAdmin.module.css";

import {
  getSection,
  createItem,
  updateItem,
  deleteItem,
} from "../../../api/crud";

import { uploadImage } from "../../../api/special";

export const EducationAdmin = () => {

  const [skillInput, setSkillInput] = useState("");

  const [educationList, setEducationList] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [newEducation, setNewEducation] = useState({
    institute: "",
    title: "",
  });

  // ================= FETCH =================

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await getSection("education");

      setEducationList(data);

      setSelectedEducation((prev) => {
        if (!prev) return data[0];

        return data.find((item) => item.id === prev.id) || data[0];
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= DESCRIPTION =================

  const handleHighlightChange = (value) => {
    setSelectedEducation((prev) => ({
      ...prev,
      points: value.split("\n"),
      // .filter((item) => item.trim() !== ""),
    }));
  };

  // ================= ADD SKILL =================

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;

    setSelectedEducation((prev) => ({
      ...prev,

      skills: [...(prev.skills || []), skillInput],
    }));

    setSkillInput("");
  };

  // ================= REMOVE SKILL =================

  const removeSkill = (skillToRemove) => {
    setSelectedEducation((prev) => ({
      ...prev,

      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // ================= SAVE =================

  const handleSave = async () => {
    try {
      if (selectedEducation.id) {
        await updateItem("education", selectedEducation.id, selectedEducation);
      } else {
        await createItem("education", selectedEducation);
      }

      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    try {
      await deleteItem("education", selectedEducation.id);
      if (!selectedEducation?.id) return;
      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD NEW =================

  const handleCreateEducation = async () => {
    try {
      const payload = {
        institute: newEducation.institute,
        title: newEducation.title,
        duration: "",
        location: "",
        cgpa: "",
        type: "Full Time",
        points: [],
        skills: [],
        logo: "",
      };

      const created = await createItem("education", payload);

      await fetchEducation();

      setSelectedEducation(created);

      setShowModal(false);

      setNewEducation({
        institute: "",
        title: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ================= IMAGE =================

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const res = await uploadImage(file, "education");

      setSelectedEducation((prev) => ({
        ...prev,
        logo: res.path
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add Education</h2>

            <input
              type="text"
              placeholder="Institute Name"
              value={newEducation.institute}
              onChange={(e) =>
                setNewEducation((prev) => ({
                  ...prev,
                  institute: e.target.value,
                }))
              }
            />

            <input
              type="text"
              placeholder="Course / Title"
              value={newEducation.title}
              onChange={(e) =>
                setNewEducation((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button onClick={handleCreateEducation}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANEL */}

      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>
          <h2>All Education</h2>

          <button
            className={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            + Add New
          </button>
        </div>

        <div className={styles.educationList}>
          {educationList.map((edu) => (
            <div
              key={edu.id}
              onClick={() => setSelectedEducation(edu)}
              className={`${styles.educationCard} ${
                selectedEducation?.id === edu.id ? styles.activeCard : ""
              }`}
            >
              <img
                src={
                  edu.logo
                    ? `${edu.logo}`
                    : "https://placehold.co/120x120"
                }
                alt={edu.institute}
              />

              <div>
                <h3>{edu.institute}</h3>

                <p>{edu.title}</p>

                <span>{edu.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className={styles.rightPanel}>
        {/* ACTIONS */}

        <div className={styles.topActions}>
          <button className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>

          <button
            className={styles.previewButton}
            onClick={() => console.log(selectedEducation)}
          >
            Console Preview
          </button>

          <button className={styles.saveButton} onClick={handleSave}>
            Save Changes
          </button>
        </div>

        {/* FORM */}

        {selectedEducation && (
          <div className={styles.formContainer}>
            <h2>Education Details</h2>
            <div className={styles.formGrid}>
              {/* LEFT */}
              <div className={styles.logoSection}>
                <label>Institute Logo</label>
                <div className={styles.logoUploadArea}>
                  <img
                    src={
                      selectedEducation.logo
                        ? `${selectedEducation.logo}`
                        : "https://placehold.co/120x120"
                    }
                    alt="logo"
                  />

                  <input
                    type="file"
                    id="logoUpload"
                    hidden
                    onChange={handleLogoUpload}
                  />

                  <label
                    htmlFor="logoUpload"
                    className={styles.changeLogoButton}
                  >
                    Change Logo
                  </label>
                </div>
              </div>

              {/* RIGHT */}

              <div className={styles.fieldsSection}>
                <div className={styles.inputGroup}>
                  <label>Institute / Organization Name</label>

                  <input
                    type="text"
                    name="institute"
                    value={selectedEducation.institute || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Degree / Course</label>

                  <input
                    type="text"
                    name="title"
                    value={selectedEducation.title || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Duration</label>

                  <input
                    type="text"
                    name="duration"
                    value={selectedEducation.duration || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={selectedEducation.location || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>CGPA / Percentage</label>

                  <input
                    type="text"
                    name="cgpa"
                    value={selectedEducation.cgpa || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Education Type</label>

                  <select
                    name="type"
                    value={selectedEducation.type || ""}
                    onChange={handleChange}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Online</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className={styles.highlightSection}>
              <label>Points / Highlights</label>

              <textarea
                rows="6"
                value={(selectedEducation.points || []).join("\n")}
                onChange={(e) => handleHighlightChange(e.target.value)}
              ></textarea>
            </div>

            {/* SKILLS */}

            <div className={styles.skillsSection}>
              <label>Skills / Subjects</label>

              <div className={styles.skillsContainer}>
                {selectedEducation?.skills?.map((skill, index) => (
                  <div key={index} className={styles.skillPill}>
                    {skill}

                    <span onClick={() => removeSkill(skill)}>×</span>
                  </div>
                ))}
              </div>

              <div className={styles.addSkillRow}>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill"
                />

                <button onClick={handleAddSkill}>+ Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
