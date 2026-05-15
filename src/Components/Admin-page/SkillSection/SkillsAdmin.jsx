import React, { useEffect, useState } from "react";

import styles from "./SkillsAdmin.module.css";

import {
  getSection,
  createItem,
  updateItem,
  deleteItem,
} from "../../../api/crud";

import { uploadImage } from "../../../api/special";

export const SkillsAdmin = () => {
  const [skills, setSkills] = useState([]);

  const [selected, setSelected] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [newSkill, setNewSkill] = useState({
    name: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const data = await getSection("skills");

    setSkills(data);

    setSelected((prev) => {
      if (!prev) return data[0];

      return data.find((s) => s.id === prev.id) || data[0];
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelected((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    await updateItem("skills", selected.id, selected);

    fetchSkills();
  };

  const handleDelete = async () => {
    await deleteItem("skills", selected.id);

    fetchSkills();
  };

  const handleCreate = async () => {
    const payload = {
      name: newSkill.name,
      image: "",
      category: "Frontend",
    };

    await createItem("skills", payload);

    fetchSkills();

    setShowModal(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const res = await uploadImage(file, "skills");

    setSelected((prev) => ({
      ...prev,
      image: res.path,
    }));
  };

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>
          <h2>All Skills</h2>

          <button onClick={() => setShowModal(true)}>
            + Add New
          </button>
        </div>

        <div className={styles.scroll}>
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`${styles.card} ${
                selected?.id === skill.id
                  ? styles.active
                  : ""
              }`}
              onClick={() => setSelected(skill)}
            >
              <img
                src={
                  skill.image ||
                  "https://placehold.co/120x120"
                }
                alt={skill.name}
              />

              <div>
                <h3>{skill.name}</h3>
                <span>{skill.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.rightPanel}>
        <div className={styles.topActions}>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Delete
          </button>

          <button
            className={styles.previewBtn}
            onClick={() => console.log(selected)}
          >
            Console Preview
          </button>

          <button
            className={styles.saveBtn}
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>

        {selected && (
          <div className={styles.form}>
            <h2>Skill Details</h2>

            <div className={styles.grid}>
              <div className={styles.logoSection}>
                <img
                  src={
                    selected.image ||
                    "https://placehold.co/120x120"
                  }
                  alt={selected.name}
                />

                <input
                  hidden
                  type="file"
                  id="skillImage"
                  onChange={handleImageUpload}
                />

                <label htmlFor="skillImage">
                  Change Image
                </label>
              </div>

              <div className={styles.fields}>
                <input
                  name="name"
                  placeholder="Skill Name"
                  value={selected.name || ""}
                  onChange={handleChange}
                />

                <select
                  name="category"
                  value={selected.category || ""}
                  onChange={handleChange}
                >
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Tools & Others</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};