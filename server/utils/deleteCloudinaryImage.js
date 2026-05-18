const cloudinary =
  require("cloudinary").v2;

const deleteCloudinaryImage =
  async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const parts =
        imageUrl.split("/");

      const fileName =
        parts[parts.length - 1];

      const folder =
        parts[parts.length - 2];

      const publicId =
        `${folder}/${fileName.split(".")[0]}`;

      await cloudinary.uploader.destroy(
        publicId
      );

      console.log(
        "Cloudinary image deleted"
      );
    } catch (err) {
      console.error(
        "Cloudinary delete failed:",
        err
      );
    }
  };

module.exports =
  deleteCloudinaryImage;