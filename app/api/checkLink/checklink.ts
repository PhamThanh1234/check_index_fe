import axios from 'axios';

export async function checkLink(data:any) {
  try {
    const response = await axios.post('http://localhost:8888/check-urls', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error API');
  }
}
