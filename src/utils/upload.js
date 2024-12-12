import axios from 'axios'
import axiosConfig from "../api/axiosConfig";

// export const uploadToCloudinary = async (file) => {
//     const cloudName = "dr1jbzn9r"; // Your Cloudinary cloud name
//     const uploadPreset = "ml_default"; // Your Cloudinary upload preset

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);
//     formData.append("cloud_name", cloudName);

//     try {
//         const response = await axios.post(
//             `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//             formData
//         );
//         return response.data.secure_url; // Return the URL of the uploaded image
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         return null; // Return null if upload fails
//     }
// };

// export const uploadToBackend = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//         const response = await axios.post(`${axiosConfig}/obra/upload`, formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//                 // Si usas autenticación basada en token:
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });
//         return response.data; // Aquí debes recibir la URL de la imagen desde el backend
//     } catch (error) {
//         console.error("Error uploading image to backend:", error);
//         return null;
//     }
// };
