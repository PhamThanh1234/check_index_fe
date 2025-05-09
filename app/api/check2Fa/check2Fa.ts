import axios from 'axios';

export async function check2Fa(data: any) {
  
  try {
    const response = await axios.post('http://localhost:8888/generate-otp', data);

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error API');
  }
}
