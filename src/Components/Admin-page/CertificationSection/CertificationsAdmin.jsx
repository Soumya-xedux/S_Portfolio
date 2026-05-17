import React, { useEffect, useState } from "react";

import styles from "./CertificationsAdmin.module.css";

import {
  getSection,
  createItem,
  updateItem,
  deleteItem,
} from "../../../api/crud";

import { uploadImage,deleteImage } from "../../../api/special";

export const CertificationsAdmin = () => {
  const [certifications, setCertifications] = useState([]);

  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [skillInput, setSkillInput] = useState("");

  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);

      const data = await getSection(
        "certifications"
      );

      setCertifications(data);

      setSelected((prev) => {
        if (!prev) return data[0] || null;

        return (
          data.find((c) => c.id === prev.id) ||
          data[0] ||
          null
        );
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
        await updateItem(
          "certifications",
          selected.id,
          selected
        );
      } else {
        await createItem(
          "certifications",
          selected
        );
      }

      await fetchCertifications();

      alert("Saved Successfully");
    } catch (err) {
      console.error(err);

      alert("Failed to save");
    }
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    try {
      if (!selected?.id) return;

      await deleteItem(
        "certifications",
        selected.id
      );

      const updated =
        certifications.filter(
          (c) => c.id !== selected.id
        );

      setCertifications(updated);

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
        title: newCert.title,
        issuer: newCert.issuer,

        date: "",

        certificateId: "",

        credentialId: "",

        certificateLink: "",

        verifyLink: "",

        skills: [],

        level: "Intermediate",

        status: "completed",

        description: "",

        glow: "cyan",

        logo: "",
      };

      await createItem(
        "certifications",
        payload
      );

      await fetchCertifications();

      setShowModal(false);

      setNewCert({
        title: "",
        issuer: "",
      });
    } catch (err) {
      console.error(err);

      alert("Creation failed");
    }
  };

  // ================= IMAGE =================
  const handleLogoUpload = async (e) => {
  try {
    const file = e.target.files[0];

    if (!file) return;

    // delete old image
    if (selected?.logo) {
      await deleteImage(selected.logo);
    }

    // upload new image
    const res = await uploadImage(
      file,
      "certifications"
    );

    setSelected((prev) => ({
      ...prev,
      logo: res.path,
    }));
  } catch (err) {
    console.error(err);

    alert("Image upload failed");
  }
};

//   const handleLogoUpload = async (e) => {
//     try {
//       const file = e.target.files[0];

//       if (!file) return;

//       const res = await uploadImage(
//         file,
//         "certifications"
//       );

//       setSelected((prev) => ({
//         ...prev,
//         logo: res.path,
//       }));
//     } catch (err) {
//       console.error(err);

//       alert("Image upload failed");
//     }
//   };

  // ================= SKILLS =================

  const addSkill = () => {
    if (!skillInput.trim()) return;

    setSelected((prev) => ({
      ...prev,

      skills: [
        ...(prev.skills || []),
        skillInput,
      ],
    }));

    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSelected((prev) => ({
      ...prev,

      skills: prev.skills.filter(
        (s) => s !== skill
      ),
    }));
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
            <h2>Add Certification</h2>

            <input
              type="text"
              placeholder="Certification Title"
              value={newCert.title}
              onChange={(e) =>
                setNewCert((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <input
              type="text"
              placeholder="Issuer"
              value={newCert.issuer}
              onChange={(e) =>
                setNewCert((prev) => ({
                  ...prev,
                  issuer: e.target.value,
                }))
              }
            />

            <div className={styles.modalActions}>
              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Delete Certification</h2>

            <p>
              Are you sure you want to
              delete
              <strong>
                {" "}
                {selected?.title}
              </strong>
              ?
            </p>

            <div className={styles.modalActions}>
              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancel
              </button>

              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT */}

      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>
          <h2>All Certifications</h2>

          <button
            onClick={() =>
              setShowModal(true)
            }
          >
            + Add New
          </button>
        </div>

        <div className={styles.scroll}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={`${styles.card} ${
                selected?.id === cert.id
                  ? styles.active
                  : ""
              }`}
              onClick={() =>
                setSelected(cert)
              }
            >
              <img
                src={
                  cert.logo
                    ? cert.logo
                    : "https://placehold.co/120x120"
                }
                alt={cert.title}
              />

              <div>
                <h3>{cert.title}</h3>

                <p>{cert.issuer}</p>

                <span>{cert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}

      <div className={styles.rightPanel}>
        {/* ACTIONS */}

        <div className={styles.topActions}>
          <button
            className={styles.deleteBtn}
            onClick={() =>
              setShowDeleteModal(true)
            }
          >
            Delete
          </button>

          <button
            className={styles.previewBtn}
            onClick={() =>
              console.log(selected)
            }
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

        {/* FORM */}

        {selected && (
          <div className={styles.form}>
            <h2>
              Certification Details
            </h2>

            <div className={styles.grid}>
              {/* LEFT */}

              <div
                className={
                  styles.logoSection
                }
              >
                <img
                  src={
                    selected.logo
                      ? selected.logo
                      : "https://placehold.co/120x120"
                  }
                  alt="logo"
                />

                <input
                  type="file"
                  hidden
                  id="certLogo"
                  onChange={
                    handleLogoUpload
                  }
                />

                <label htmlFor="certLogo">
                  Change Logo
                </label>
              </div>

              {/* RIGHT */}

              <div
                className={styles.fields}
              >
                <input
                  name="title"
                  placeholder="Title"
                  value={
                    selected.title || ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="issuer"
                  placeholder="Issuer"
                  value={
                    selected.issuer ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="date"
                  placeholder="Date"
                  value={
                    selected.date || ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="certificateId"
                  placeholder="Certificate ID"
                  value={
                    selected.certificateId ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="credentialId"
                  placeholder="Credential ID"
                  value={
                    selected.credentialId ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="certificateLink"
                  placeholder="Certificate Link"
                  value={
                    selected.certificateLink ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="verifyLink"
                  placeholder="Verify Link"
                  value={
                    selected.verifyLink ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <select
                  name="level"
                  value={
                    selected.level ||
                    "Intermediate"
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option>
                    Beginner
                  </option>

                  <option>
                    Intermediate
                  </option>

                  <option>
                    Advanced
                  </option>
                </select>

                <select
                  name="status"
                  value={
                    selected.status ||
                    "completed"
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="completed">
                    Completed
                  </option>

                  <option value="ongoing">
                    Ongoing
                  </option>
                </select>

                <select
                  name="glow"
                  value={
                    selected.glow ||
                    "cyan"
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="cyan">
                    Cyan
                  </option>

                  <option value="pink">
                    Pink
                  </option>
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}

            <textarea
              rows="5"
              name="description"
              placeholder="Description"
              value={
                selected.description ||
                ""
              }
              onChange={handleChange}
            />

            {/* SKILLS */}

            <div
              className={
                styles.skillsSection
              }
            >
              <div
                className={styles.skills}
              >
                {selected.skills?.map(
                  (skill, i) => (
                    <div
                      key={i}
                      className={
                        styles.skill
                      }
                    >
                      {skill}

                      <span
                        onClick={() =>
                          removeSkill(
                            skill
                          )
                        }
                      >
                        ×
                      </span>
                    </div>
                  )
                )}
              </div>

              <div
                className={
                  styles.addSkill
                }
              >
                <input
                  value={skillInput}
                  onChange={(e) =>
                    setSkillInput(
                      e.target.value
                    )
                  }
                  placeholder="Add skill"
                />

                <button
                  onClick={addSkill}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};