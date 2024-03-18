import axios from "axios";

export const uploadImage = async (payload) => {
  try {
    const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, payload);
    return response.data.secure_url;
  } catch (error) {
    throw error;
  }
};
