const { v2: cloudinary } = require("cloudinary");

// Configuration
cloudinary.config({
  cloud_name: "detftrt04",
  api_key: "149163776141632",
  api_secret: "yrtUT3PmkmRRgBrllb_LwXIrXN4", // Click 'View API Keys' above to copy your API secret
});
module.exports.UploadImage = async (src, name) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(src, {
      folder: "my_project/recipe",
      public_id: name,
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult.secure_url;
};

module.exports.UploadMultipleImage = async (imagePaths) => {
  const uploadPromises = imagePaths.map((path, i) =>
    cloudinary.uploader.upload(path, {
      folder: "my_project/recipe/step",
      public_id: `step_image_${Date.now()}`,
    })
  );

  const results = await Promise.all(uploadPromises);
  return results.map((r) => r.secure_url);
};
