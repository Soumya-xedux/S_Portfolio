import { api } from "./client";

export const getAllData = async () => {
  const res = await api.get("/data");
  return res.data;
};

export const getAbout = async () => {
  const res = await api.get("/about");
  return res.data;
};

export const updateAbout = async (data) => {
  const res = await api.put("/about", data);
  return res.data;
};

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

export const deleteImage = async (
  imageUrl
) => {
  try {
    const res = await api.delete(
      "/delete-image",
      {
        data: { imageUrl },
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "special.js: Delete Error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};