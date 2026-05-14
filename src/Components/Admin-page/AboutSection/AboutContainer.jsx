import React, { useEffect, useState } from "react";
import styles from "./AboutContainer.module.css";
import { API_BASE } from "../../../config/api";

export const AboutContainer = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profile: "",
    location: "",
  });

  const BASE = `${API_BASE}`;

  // 🔹 fetch existing data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${BASE}/about`);

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAbout();
  }, [BASE]);

  // 🔹 handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(`${BASE}/upload`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    setFormData({
      ...formData,
      profile: data.path.replace(BASE + "/uploads/", ""),
    });
  };

  // 🔹 save data
  const handleSave = async () => {
    await fetch(`${BASE}/about`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    alert("Saved");
  };

  return (
    <div className={styles.aboutContainer}>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />

      <input type="file" onChange={handleImageUpload} />

      {formData.profile && (
        <img
          src={`${BASE}/uploads/${formData.profile}`}
          alt="preview"
          width="120"
        />
      )}

      <button className={styles.save} onClick={handleSave}>
        Save
      </button>
    </div>
  );
};
