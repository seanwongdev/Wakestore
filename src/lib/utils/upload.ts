export const uploadCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "devprojects");
  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dleikmnsf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data?.secure_url;
  } catch (err: any) {
    console.error("Error uploading to Cloudinary:", err.message);
  }
};
