// src/utils/getUserDetails.ts
import axios from "axios";

export const getUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/auth/users/${userId}`
    );
    return response.data; // assuming response.data contains the user details
  } catch (error) {
    console.error("Failed to fetch user details", error);
    return null;
  }
};
