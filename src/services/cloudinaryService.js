const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadImage = async (file, folder = "general") => {
  if (!file) throw new Error("No file provided");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `jenu-gumpu/${folder}`);
  const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
  if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
  const data = await response.json();
  return data.secure_url;
};

export const uploadMultipleImages = async (files, folder = "general") => {
  if (!files || files.length === 0) return [];
  const uploadPromises = Array.from(files).map((file) => uploadImage(file, folder));
  return await Promise.all(uploadPromises);
};

export const getOptimizedUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  const { width = 800, quality = "auto" } = options;
  const transformations = `q_${quality},f_auto,w_${width},c_limit`;
  return url.replace("/upload/", `/upload/${transformations}/`);
};
