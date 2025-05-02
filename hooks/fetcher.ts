import { axiosInstance } from "@/app/api/axiosInstance";

export const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url); // Axios request
  return response.data; // Return the data from the response
};