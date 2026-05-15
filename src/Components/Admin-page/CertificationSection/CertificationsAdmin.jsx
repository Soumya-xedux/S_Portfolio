import React, { useEffect, useState } from "react";
import styles from "./CertificationsAdmin.module.css";

import {
  getSection,
  createItem,
  updateItem,
  deleteItem,
} from "../../../api/crud";

import { uploadImage } from "../../../api/special";

export const CertificationsAdmin = () => {
  const [certifications, setCertifications] = useState([]);
  const [selected, setSelected] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [skillInput, setSkillInput] = useState("");

  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    const data = await getSection("certifications");

    setCertifications(data);

    setSelected((prev) => {
      if (!prev) return data[0];

      return data.find((c) => c.id === prev.id) || data[0];
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
    if (selected.id) {
      await updateItem("certifications", selected.id, selected);
    } else {
      await createItem("certifications", selected);
    }

    fetchCertifications();
  };

  const handleDelete = async () => {
    if (!selected?.id) return;

    await deleteItem("certifications", selected.id);

    fetchCertifications();
  };

  const handleCreate = async () => {
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

    await createItem("certifications", payload);

    fetchCertifications();

    setShowModal(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const res = await uploadImage(file, "certifications");

    setSelected((prev) => ({
      ...prev,
      logo: res.path,
    }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    setSelected((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput],
    }));

    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSelected((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>
          <h2>All Certifications</h2>

          <button onClick={() => setShowModal(true)}>
            + Add New
          </button>
        </div>

        <div className={styles.scroll}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={`${styles.card} ${
                selected?.id === cert.id ? styles.active : ""
              }`}
              onClick={() => setSelected(cert)}
            >
              <img
                src={
                  cert.logo ||
                  "https://placehold.co/120x120"
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
            <h2>Certification Details</h2>

            <div className={styles.grid}>
              <div className={styles.logoSection}>
                <img
                  src={
                    selected.logo ||
                    "https://placehold.co/120x120"
                  }
                  alt="logo"
                />

                <input
                  type="file"
                  hidden
                  id="certLogo"
                  onChange={handleLogoUpload}
                />

                <label htmlFor="certLogo">
                  Change Logo
                </label>
              </div>

              <div className={styles.fields}>
                <input
                  name="title"
                  placeholder="Title"
                  value={selected.title || ""}
                  onChange={handleChange}
                />

                <input
                  name="issuer"
                  placeholder="Issuer"
                  value={selected.issuer || ""}
                  onChange={handleChange}
                />

                <input
                  name="date"
                  placeholder="Date"
                  value={selected.date || ""}
                  onChange={handleChange}
                />

                <input
                  name="certificateId"
                  placeholder="Certificate ID"
                  value={selected.certificateId || ""}
                  onChange={handleChange}
                />

                <input
                  name="certificateLink"
                  placeholder="Certificate Link"
                  value={selected.certificateLink || ""}
                  onChange={handleChange}
                />

                <select
                  name="glow"
                  value={selected.glow || "cyan"}
                  onChange={handleChange}
                >
                  <option value="cyan">Cyan</option>
                  <option value="pink">Pink</option>
                </select>
              </div>
            </div>

            <textarea
              rows="5"
              name="description"
              placeholder="Description"
              value={selected.description || ""}
              onChange={handleChange}
            />

            {/* Skills */}
            <div className={styles.skillsSection}>
              <div className={styles.skills}>
                {selected.skills?.map((skill, i) => (
                  <div key={i} className={styles.skill}>
                    {skill}

                    <span
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.addSkill}>
                <input
                  value={skillInput}
                  onChange={(e) =>
                    setSkillInput(e.target.value)
                  }
                />

                <button onClick={addSkill}>
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