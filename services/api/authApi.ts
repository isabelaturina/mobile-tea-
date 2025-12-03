import axios from "axios";

// SUA URL DA API AQUI:
const API_URL = "https://crud-tea.onrender.com"; 

export const authApi = {
  // Cadastro (SignUp)
  register: async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  },
};
