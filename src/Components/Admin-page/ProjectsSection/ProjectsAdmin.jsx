import React, { useEffect, useState, useRef } from "react";
import styles from "./ProjectsAdmin.module.css";
import { uploadImage, deleteImage, } from "../../../api/special";
import {
  getSection,
  createItem,
  updateItem,
  deleteItem,
} from "../../../api/crud";

export const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    status: "In Progress",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getSection("projects");
    setProjects(data);

    setSelected((prev) => {
      if (!prev) return data[0] || null;

      return data.find((item) => item.id === prev.id) || data[0] || null;
    });
  };

  const handleChange = (field, value) => {
    setSelected((prev) => ({ ...prev, [field]: value }));
  };

  const updateDetails = (field, value) => {
    setSelected((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }));
  };

  // ---------- UPLOAD Image -----------

  const handleImageUpload = async (file) => {
  if (!file) return;

  try {
    // delete old image
    if (selected?.image) {
      await deleteImage(selected.image);
    }

    // upload new image
    const res = await uploadImage(
      file,
      "projects"
    );

    setSelected((prev) => ({
      ...prev,
      image: res.path,
    }));
  } catch (err) {
    console.log(err);
  }
};

  // const handleImageUpload = async (file) => {
  //   if (!file) return;

  //   try {
  //     const res = await uploadImage(file, "projects");

  //     setSelected((prev) => ({
  //       ...prev,
  //       image: res.path,
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

  // ---------- FEATURES ----------
  const addFeature = () => {
    updateDetails("features", [...selected.details.features, ""]);
  };

  const updateFeature = (i, value) => {
    const updated = [...selected.details.features];
    updated[i] = value;
    updateDetails("features", updated);
  };

  const removeFeature = (i) => {
    const updated = selected.details.features.filter((_, idx) => idx !== i);
    updateDetails("features", updated);
  };

  // ---------- CHALLENGES ----------
  const addChallenge = () => {
    updateDetails("challenges", [
      ...selected.details.challenges,
      { problem: "", solution: "" },
    ]);
  };

  const updateChallenge = (i, field, value) => {
    const updated = [...selected.details.challenges];
    updated[i][field] = value;
    updateDetails("challenges", updated);
  };

  // ---------- SAVE CHANGES ------------
  const handleSave = async () => {
    if (!selected) return;

    try {
      if (selected.id) {
        await updateItem("projects", selected.id, selected);
      } else {
        await createItem("projects", selected);
      }

      await loadProjects();
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  };

  const handleCreateProject = async () => {
    try {
      const payload = {
        title: newProject.title,
        status: newProject.status,
        description: "",
        image: "",
        tech: [],
        liveLink: "",
        githubLink: "",
        details: {
          problemStatement: "",
          architecturalOverview: "",
          solution: "",
          features: [],
          challenges: [],
        },
      };

      const response = await createItem("projects", payload);

      const created = response.data.data;

      await loadProjects();

      setSelected(created);

      setShowModal(false);

      setNewProject({
        title: "",
        status: "In Progress",
      });
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;

    try {
      await deleteItem("projects", selected.id);

      const updatedProjects = projects.filter((p) => p.id !== selected.id);

      setProjects(updatedProjects);

      setSelected(updatedProjects[0] || null);

      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };
  return (
    <div className={styles.container}>
      <Sidebar
        projects={projects}
        selected={selected}
        setSelected={setSelected}
        onAdd={() => setShowModal(true)}
      />

      {showDeleteModal && (
        <DeleteModal
          projectTitle={selected?.title}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
      {showModal && (
        <AddProjectModal
          newProject={newProject}
          setNewProject={setNewProject}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateProject}
        />
      )}
      {selected && (
        <div className={styles.formWrapper}>
          <TopActions
            onSave={handleSave}
            onDiscard={() => loadProjects()} // or reset state
            onPreview={() => console.log("preview")}
            onDelete={() => setShowDeleteModal(true)}
          />

          <div className={styles.formScroll}>
            <BasicInfo
              selected={selected}
              handleChange={handleChange}
              handleImageUpload={handleImageUpload}
            />
            <TechStack
              selected={selected}
              techInput={techInput}
              setTechInput={setTechInput}
              addTech={addTech}
              removeTech={removeTech}
            />
            <LinksAndDetails
              selected={selected}
              handleChange={handleChange}
              updateDetails={updateDetails}
            />
            <FeaturesSection
              selected={selected}
              addFeature={addFeature}
              updateFeature={updateFeature}
              removeFeature={removeFeature}
            />
            <ChallengesSection
              selected={selected}
              addChallenge={addChallenge}
              updateChallenge={updateChallenge}
            />
          </div>
        </div>
      )}

      {selected && <PreviewPanel selected={selected} />}
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
        Preview
      </button>

      <button className={styles.saveBtn} onClick={onSave}>
        Save Changes
      </button>
    </div>
  );
};

const Sidebar = ({ projects, selected, setSelected, onAdd }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>All Projects</h3>
        <button onClick={onAdd}>+ Add New</button>
      </div>

      <div className={styles.scroll}>
        {projects.map((p) => (
          <div
            key={p.id}
            className={`${styles.item} ${
              selected?.id === p.id ? styles.active : ""
            }`}
            onClick={() => setSelected(p)}
          >
            <img
              src={p.image || "https://placehold.co/120x120"}
              alt={p.title}
            />
            <div>
              <h4>{p.title}</h4>
              <span>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddProjectModal = ({ newProject, setNewProject, onClose, onCreate }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Project</h2>

        <input
          placeholder="Project Title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />

        <select
          value={newProject.status}
          onChange={(e) =>
            setNewProject((prev) => ({
              ...prev,
              status: e.target.value,
            }))
          }
        >
          <option>In Progress</option>
          <option>Completed</option>
          <option>Upcoming</option>
        </select>

        <div className={styles.modalActions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ onCancel, onConfirm, projectTitle }) => {
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

const BasicInfo = ({ selected, handleChange, handleImageUpload }) => {
  const fileInputRef = useRef(null);
  return (
    <div className={styles.card}>
      <h3 style={{ fontSize: "18px" }}>Basic Information</h3>

      <div className={styles.row}>
        <div className={styles.imageBox}>
          <h3 style={{ color: "white", fontSize: "12px" }}>Project Image</h3>
          <img
            src={selected.image || "https://placehold.co/120x120"}
            alt={selected.title}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
          <button onClick={() => fileInputRef.current.click()}>
            Change Image
          </button>
        </div>

        <div className={styles.flexGrow}>
          <div>
            <label htmlFor="title" style={{ color: "white", fontSize: "12px" }}>
              Project Title
            </label>
            <input
              required
              id="title"
              value={selected.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              style={{ color: "white", fontSize: "12px" }}
            >
              Project Status
            </label>
            <select
              id="status"
              value={selected.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option>In Progress</option>
              <option>Completed</option>
              <option>Upcoming</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              style={{ color: "white", fontSize: "12px" }}
            >
              Short Description
            </label>
            <textarea
              id="description"
              value={selected.description}
              onChange={(e) => handleChange("description", e.target.value)}
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

const LinksAndDetails = ({ selected, handleChange, updateDetails }) => {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>Project Links</h3>
        <input
          value={selected.liveLink || ""}
          onChange={(e) => handleChange("liveLink", e.target.value)}
        />
        <input
          value={selected.githubLink}
          onChange={(e) => handleChange("githubLink", e.target.value)}
        />
      </div>

      <div className={styles.card}>
        <h3>Details</h3>

        <textarea
          value={selected.details.problemStatement}
          onChange={(e) => updateDetails("problemStatement", e.target.value)}
        />

        <textarea
          value={selected.details.architecturalOverview}
          onChange={(e) =>
            updateDetails("architecturalOverview", e.target.value)
          }
        />

        <textarea
          value={selected.details.solution}
          onChange={(e) => updateDetails("solution", e.target.value)}
        />
      </div>
    </div>
  );
};

const FeaturesSection = ({
  selected,
  addFeature,
  updateFeature,
  removeFeature,
}) => {
  return (
    <div className={styles.card}>
      <h3>Features</h3>

      {selected.details.features?.map((f, i) => (
        <div key={i} className={styles.row}>
          <input value={f} onChange={(e) => updateFeature(i, e.target.value)} />
          <button onClick={() => removeFeature(i)}>✕</button>
        </div>
      ))}

      <button onClick={addFeature}>+ Add Feature</button>
    </div>
  );
};

const ChallengesSection = ({ selected, addChallenge, updateChallenge }) => {
  return (
    <div className={styles.card}>
      <h3>Challenges</h3>

      {selected.details.challenges?.map((c, i) => (
        <div key={i} className={styles.challengeRow}>
          <input
            value={c.problem}
            onChange={(e) => updateChallenge(i, "problem", e.target.value)}
          />
          <input
            value={c.solution}
            onChange={(e) => updateChallenge(i, "solution", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addChallenge}>+ Add Challenge</button>
    </div>
  );
};

const PreviewPanel = ({ selected }) => {
  return (
    <div className={styles.preview}>
      <span className={styles.badge}>{selected.status}</span>
      <h2>{selected.title}</h2>
      <p>{selected.description}</p>

      <img
        src={selected.image || "https://placehold.co/120x120"}
        alt={selected.title}
      />

      <div className={styles.previewBtns}>
        <button>
          <a href={selected.liveLink} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        </button>
        <button>GitHub Repo</button>
      </div>
    </div>
  );
};
