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

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newSkill, setNewSkill] = useState({
    name: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  // ================= FETCH =================

  const fetchSkills = async () => {
    try {
      setLoading(true);

      const data = await getSection("skills");

      setSkills(data);

      setSelected((prev) => {
        if (!prev) return data[0] || null;

        return data.find((s) => s.id === prev.id) || data[0] || null;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelected((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SAVE =================

  const handleSave = async () => {
    try {
      if (!selected) return;

      if (selected.id) {
        await updateItem("skills", selected.id, selected);
      } else {
        await createItem("skills", selected);
      }

      await fetchSkills();

      alert("Saved Successfully");
    } catch (err) {
      console.error(err);

      alert("Save failed");
    }
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    try {
      if (!selected?.id) return;

      await deleteItem("skills", selected.id);

      const updated = skills.filter((s) => s.id !== selected.id);

      setSkills(updated);

      setSelected(updated[0] || null);

      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);

      alert("Delete failed");
    }
  };

  // ================= CREATE =================

  const handleCreate = async () => {
    try {
      const payload = {
        name: newSkill.name,
        image: "",
        category: "Frontend",
      };

      await createItem("skills", payload);

      await fetchSkills();

      setShowModal(false);

      setNewSkill({
        name: "",
      });
    } catch (err) {
      console.error(err);

      alert("Creation failed");
    }
  };

  // ================= IMAGE =================

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const res = await uploadImage(file, "skills");

      setSelected((prev) => ({
        ...prev,
        image: res.path,
      }));
    } catch (err) {
      console.error(err);

      alert("Image upload failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* CREATE MODAL */}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add Skill</h2>

            <input
              type="text"
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Delete Skill</h2>

            <p>
              Are you sure you want to delete
              <strong> {selected?.name}</strong>?
            </p>

            <div className={styles.modalActions}>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>

              <button className={styles.deleteBtn} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANEL */}

      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>
          <h2>All Skills</h2>

          <button onClick={() => setShowModal(true)}>+ Add New</button>
        </div>

        <div className={styles.scroll}>
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`${styles.card} ${
                selected?.id === skill.id ? styles.active : ""
              }`}
              onClick={() => setSelected(skill)}
            >
              <img
                src={skill.image ? skill.image : "https://placehold.co/120x120"}
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

      {/* RIGHT PANEL */}

      <div className={styles.rightPanel}>
        {/* ACTIONS */}

        <div className={styles.topActions}>
          <button
            className={styles.deleteBtn}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

          <button
            className={styles.previewBtn}
            onClick={() => console.log(selected)}
          >
            Console Preview
          </button>

          <button className={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </button>
        </div>

        {/* FORM */}

        {selected && (
          <div className={styles.form}>
            <h2>Skill Details</h2>

            <div className={styles.grid}>
              {/* LEFT */}

              <div className={styles.logoSection}>
                <img
                  src={
                    selected.image
                      ? selected.image
                      : "https://placehold.co/120x120"
                  }
                  alt={selected.name}
                />

                <input
                  hidden
                  type="file"
                  id="skillImage"
                  onChange={handleImageUpload}
                />

                <label htmlFor="skillImage">Change Image</label>
              </div>

              {/* RIGHT */}

              <div className={styles.fields}>
                <div className={styles.inputGroup}>
                  <label>Skill Name</label>

                  <input
                    name="name"
                    placeholder="Skill Name"
                    value={selected.name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Category</label>

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

                <div className={styles.inputGroup}>
                  <label>Image URL</label>

                  <input
                    name="image"
                    placeholder="Image URL"
                    value={selected.image || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
