import axios from "axios";
import qs from "qs";

const API_URL = "http://31.97.53.214:3000/api/admin/v1/auth";

export interface Credentials {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export const loginAdmin = async (credentials: Credentials) => {
  try {
    const data = qs.stringify({
      email: credentials.email,
      password: credentials.password,
    });

    const response = await axios.post(`${API_URL}/login`, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { accessToken } = response.data.data;
    localStorage.setItem("authToken", accessToken);
    return response.data;
  } catch (err) {
    const message = err.response?.data.message || "An error occurred during login";
    // Throw a structured error
    throw { message };
  }
};

export const logoutAdmin = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw { message: "No token available", status: 401 };
    }
    
    const response = await axios.put(
      `${API_URL}/logout`,
      qs.stringify({}),
      { headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/x-www-form-urlencoded" 
      } }
    );

    localStorage.clear();
    return response.data;
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message || "An error occurred during logout";
    
    // Clear storage even if logout API fails due to token issues
    if (status === 400 || status === 401) {
      localStorage.clear();
    }

    throw { message, status };  // Forward status for error handling
  }
};
