import axios from "axios";

const API_URL = "https://chat-tea-gx0y.onrender.com";

export const getGroupMessages = async () => {
  try {
    const response = await axios.get(API_URL, { timeout: 15000 });
    return response.data; // retorna { data: [...] }
  } catch (error) {
    console.log("Erro API Chat Grupo:", error);
    throw error;
  }
};

// ✅ Agora sendGroupMessage espera um objeto { texto, usuario, userId }
export const sendGroupMessage = async ({ texto, usuario, userId }: { texto: string; usuario: string; userId: string; }) => {
  try {
    const response = await axios.post(
      API_URL,
      { texto, usuario, userId }, // corpo do POST
      { timeout: 15000 }
    );
    return response.data;
  } catch (error) {
    console.log("Erro ao enviar mensagem:", error);
    throw error;
  }
};