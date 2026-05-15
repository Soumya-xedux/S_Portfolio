import React, { useEffect, useState } from "react";
import styles from "./AboutContainer.module.css";

import {
  getAbout,
  updateAbout,
  uploadImage,
} from "../../../api/special";

export const AboutContainer = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profile: "",
    location: "",
  });

  // Fetch existing data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getAbout();

        setFormData(data);

      } catch (err) {
        console.error(
          "Failed to fetch about data:",
          err
        );
      }
    };

    fetchAbout();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  // Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const data = await uploadImage(
        file,
        "about"
      );

      setFormData((prev) => ({
        ...prev,

        profile: data.path,
      }));

    } catch (err) {
      console.error(
        "Image upload failed:",
        err
      );
    }
  };

  // Save data
  const handleSave = async () => {
    try {
      await updateAbout(formData);

      alert("Saved successfully");

    } catch (err) {
      console.error(
        "Failed to save:",
        err
      );
    }
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

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {formData.profile && (
        <img
          src={formData.profile}
          alt="Profile Preview"
          width="120"
        />
      )}

      <button
        className={styles.save}
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};