import React, { useEffect, useState, useRef } from "react";
import styles from "./ExperienceContainer.module.css";
import { uploadImage, deleteImage } from "../../../api/special";
import {
  getSection,
  createItem,
  updateItem,
  deleteItem,
} from "../../../api/crud";



export const ExperienceContainer = () => {
  const [experiences, setExperiences] = useState([]);
  const [selected, setSelected] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newExperience, setNewExperience] = useState({
    id: "",
    logo: "",
    company: "",
    role: "",
    duration: "",
    current_company: "no",
    location: "",
    details: "",
    tech: [],
  });

  useEffect(() => {
    loadExperiences();
  },);

  const loadExperiences = async () => {
    try {
      const data = await getSection("experience");

      setExperiences(data);

      if (!selected && data.length) {
        setSelected(data[0]);
      }
    } catch (err) {
      console.error("Failed to load experiences:", err);
    }
  };

  const handleChange = (field, value) => {
    setSelected((prev) => ({ ...prev, [field]: value }));
  };
  // ---------- UPLOAD LOGO -----------

  const handleLogoUpload = async (file) => {
  console.log("STEP 1 FILE:", file);

  if (!file) return;

  try {
    // delete old image
    if (selected?.logo) {
      await deleteImage(selected.logo);
    }

    // upload new image
    const res = await uploadImage(
      file,
      "experience"
    );

    console.log(
      "STEP 2 RESPONSE:",
      res
    );

    setSelected((prev) => ({
      ...prev,
      logo: res.path,
    }));
  } catch (err) {
    console.log(err);
  }
};

  // const handleLogoUpload = async (file) => {
  //   console.log("STEP 1 FILE:", file);
  //   if (!file) return;

  //   try {
  //     const res = await uploadImage(file, "experience");
  //     console.log("STEP 2 RESPONSE:", res);
  //     setSelected((prev) => ({
  //       ...prev,
  //       logo: res.path,
  //     }));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // ---------- TECH ----------
  const addTech = () => {
    if (!techInput) return;
    setSelected((prev) => ({
      ...prev,
      tech: [...(prev.tech || []), techInput],
    }));
    setTechInput("");
  };

  const removeTech = (index) => {
    const updated = [...selected.tech];
    updated.splice(index, 1);
    handleChange("tech", updated);
  };

  // ---------- SAVE CHANGES ------------
  const handleSave = async () => {
    if (!selected) return;
    if (selected.id) {
      await updateItem("experience", selected.id, selected);
    } else {
      await createItem("experience", selected);
    }
    loadExperiences();
  };

  const handleCreateExperience = async () => {
    const payload = {
      id: newExperience.id,
      logo: "",
      company: newExperience.company,
      role: newExperience.role,
      duration: "",
      current_company: newExperience.current_company,
      location: "",
      details: "",
      tech: [],
    };
    const response = await createItem("experience", payload);
    const created = response.data.data;
    await loadExperiences();
    setSelected(created);
    setShowModal(false);
    setNewExperience({
      id: "",
      logo: "",
      company: "",
      role: "",
      duration: "",
      current_company: "",
      location: "",
      details: "",
      tech: [],
    });
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    await deleteItem("experience", selected.id);
    const updatedexperiences = experiences.filter((p) => p.id !== selected.id);
    setExperiences(updatedexperiences);
    setSelected(updatedexperiences[0] || null);
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.container}>
      <Sidebar
        experiences={experiences}
        selected={selected}
        setSelected={setSelected}
        onAdd={() => setShowModal(true)}
      />

      {showDeleteModal && (
        <DeleteExperienceModal
          projectTitle={selected?.company}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
      {showModal && (
        <AddExperienceModal
          newExperience={newExperience}
          setNewExperience={setNewExperience}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateExperience}
        />
      )}
      {selected && (
        <div className={styles.formWrapper}>
          <TopActions
            onSave={handleSave}
            onDiscard={() => loadExperiences()} // or reset state
            onPreview={() => console.log("preview")}
            onDelete={() => setShowDeleteModal(true)}
          />

          <div className={styles.formScroll}>
            <BasicInfo
              selected={selected}
              handleChange={handleChange}
              handleLogoUpload={handleLogoUpload}
            />
            <TechStack
              selected={selected}
              techInput={techInput}
              setTechInput={setTechInput}
              addTech={addTech}
              removeTech={removeTech}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TopActions = ({ onSave, onDiscard, onPreview, onDelete }) => {
  return (
    <div className={styles.topActions}>
      <button className={styles.deleteBtn} onClick={onDelete}>
        Delete
      </button>
      <button className={styles.discardBtn} onClick={onDiscard}>
        Discard
      </button>

      <button className={styles.previewBtn} onClick={onPreview}>
        Console Preview
      </button>

      <button className={styles.saveBtn} onClick={onSave}>
        Save Changes
      </button>
    </div>
  );
};

const Sidebar = ({ experiences, selected, setSelected, onAdd }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>All experiences</h3>
        <button onClick={onAdd}>+ Add New</button>
      </div>

      <div className={styles.scroll}>
        {experiences.map((p) => (
          <div
            key={p.id}
            className={`${styles.item} ${
              selected?.id === p.id ? styles.active : ""
            }`}
            onClick={() => setSelected(p)}
          >
            <img
              src={p.logo ? p.logo : "https://placehold.co/120x120"}
              alt="Logo Here"
            />
            <div>
              <h4>{p.company}</h4>
              <span>{p.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddExperienceModal = ({
  newExperience,
  setNewExperience,
  onClose,
  onCreate,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Experience</h2>
        <input
          name="ID"
          placeholder="ID"
          value={newExperience.id}
          onChange={(e) =>
            setNewExperience((prev) => ({
              ...prev,
              id: e.target.value,
            }))
          }
        />

        <input
          name="company"
          placeholder="Company Name"
          value={newExperience.company}
          onChange={(e) =>
            setNewExperience((prev) => ({
              ...prev,
              company: e.target.value,
            }))
          }
        />
        <input
          name="job_role"
          placeholder="Job Role"
          value={newExperience.role}
          onChange={(e) =>
            setNewExperience((prev) => ({
              ...prev,
              role: e.target.value,
            }))
          }
        />
        <h3>Is it current company?</h3>
        <select
          value={newExperience.current_company}
          onChange={(e) =>
            setNewExperience((prev) => ({
              ...prev,
              current_company: e.target.value,
            }))
          }
        >
          <option>no</option>
          <option>yes</option>
        </select>

        <div className={styles.modalActions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

const DeleteExperienceModal = ({ onCancel, onConfirm, projectTitle }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Delete Project</h2>

        <p>
          Are you sure you want to delete
          <strong> {projectTitle} </strong>?
        </p>

        <div className={styles.modalActions}>
          <button onClick={onCancel}>Cancel</button>

          <button className={styles.deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const BasicInfo = ({ selected, handleChange, handleLogoUpload }) => {
  const fileInputRef = useRef(null);
  return (
    <div className={styles.card}>
      <h3 style={{ fontSize: "18px" }}>Work Experience</h3>

      <div className={styles.row}>
        <div className={styles.imageBox}>
          <h3 style={{ color: "white", fontSize: "12px" }}>Company Logo</h3>
          <img
              src={selected.logo ? selected.logo : "https://placehold.co/120x120"}
              alt="Logo Here"
            />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={(e) => handleLogoUpload(e.target.files[0])}
          />
          <button onClick={() => fileInputRef.current.click()}>
            Change Logo
          </button>
        </div>

        <div className={styles.flexGrow}>
          <div>
            <label
              htmlFor="company"
              style={{ color: "white", fontSize: "12px" }}
            >
              Company Name
            </label>
            <input
              required
              id="company"
              value={selected.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="role" style={{ color: "white", fontSize: "12px" }}>
              Role
            </label>
            <input
              required
              id="role"
              value={selected.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="current_company"
              style={{ color: "white", fontSize: "12px" }}
            >
              Currently working here?
            </label>
            <select
              id="current_company"
              value={selected.current_company}
              onChange={(e) => handleChange("current_company", e.target.value)}
            >
              <option>yes</option>
              <option>no</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="details"
              style={{ color: "white", fontSize: "12px" }}
            >
              Overall Work Details
            </label>
            <textarea
              id="details"
              value={selected.details}
              onChange={(e) => handleChange("details", e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="duration"
              style={{ color: "white", fontSize: "12px" }}
            >
              Duration
            </label>
            <textarea
              id="duration"
              value={selected.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TechStack = ({
  selected,
  techInput,
  setTechInput,
  addTech,
  removeTech,
}) => {
  return (
    <div className={styles.card}>
      <h3>Tech Stack</h3>

      <div className={styles.tags}>
        {selected.tech?.map((t, i) => (
          <span key={i} onClick={() => removeTech(i)}>
            {t} ✕
          </span>
        ))}
      </div>

      <div className={styles.addRow}>
        <input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
        />
        <button onClick={addTech}>+ Add</button>
      </div>
    </div>
  );
};
