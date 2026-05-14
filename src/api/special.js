import { api } from "./client";

export const getAllData = () =>
  api.get("/data").then(res => res.data);

export const getAbout = () =>
  api.get("/about").then(res => res.data);

export const updateAbout = (data) =>
  api.put("/about", data);

export const uploadImage = async (file, section) => {
  // Log exactly what we are sending
  console.log("special.js: Sending file:", file.name, "to section:", section);

  const fd = new FormData();
  fd.append("image", file); // This key MUST match upload.single("image")

  try {
    const res = await api.post(
      `/upload?section=${section}`,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("special.js: Upload Error:", error.response?.data || error.message);
    throw error;
  }
};