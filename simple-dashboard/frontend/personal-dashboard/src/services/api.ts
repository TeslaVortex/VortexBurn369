import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getXAITip = async (): Promise<string> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/xai/tip`);
    return response.data.tip;
  } catch (error) {
    console.error('Error fetching xAI tip:', error);
    throw error;
  }
};

export default axios.create({
  baseURL: API_BASE_URL,
});
