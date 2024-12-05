import { config } from '@/config';
import axios, { AxiosResponse } from 'axios';
import { CreateCategory, Category } from '../../schemas/categoriesschema';

export const categoriesService = {
  // Method to get all categories
  getEntities: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/categories`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getEntity: async (id:number): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/categories/${id}`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  // Method to delete a user by ID
  deleteEntity: async (userId: number): Promise<AxiosResponse> => {
    try {
      const response = await axios.delete(`${config.apiUrl}/categories/${userId}`);
      return response; // Handle the response data (e.g., confirmation of deletion)
    } catch (error: any) {
      return error;
    }
  },

  postCategory: async (data: CreateCategory): Promise<AxiosResponse> => {
    try {
      const response = await axios.post(`${config.apiUrl}/categories`, data);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  // Method to update an existing user
  putCategory: async (data: Category): Promise<AxiosResponse> => {
    try {
      const response = await axios.put(`${config.apiUrl}/categories/`, data);
      return response;
    } catch (error: any) {
      return error;
    }
  },
}
