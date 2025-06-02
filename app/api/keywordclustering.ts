import axios from 'axios';
export interface KeywordPayload {
  keywords: string[];
}
export async function checkLink(data: KeywordPayload) {
  try {
    console.log(data)
    const response = await axios.post('http://localhost:8888/keywords/group', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error API');
  }
}
