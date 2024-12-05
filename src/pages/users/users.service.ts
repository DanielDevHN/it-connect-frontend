import { config } from '@/config';
import axios, { AxiosResponse } from 'axios';
import { CreateUser, User } from '../../schemas/usersschema';

export const usersService = {
  // Method to get all users
  getEntities: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/users`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getEntity: async (id:number): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/users/${id}`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  // Method to delete a user by ID
  deleteEntity: async (userId: number): Promise<AxiosResponse> => {
    try {
      const response = await axios.delete(`${config.apiUrl}/users/${userId}`);
      return response; // Handle the response data (e.g., confirmation of deletion)
    } catch (error: any) {
      return error;
    }
  },

  postUser: async (userData: CreateUser): Promise<AxiosResponse> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataWithoutConfirmPassword } = userData;

      const response = await axios.post(`${config.apiUrl}/users`, dataWithoutConfirmPassword);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  // Method to update an existing user
  putUser: async (userData: User): Promise<AxiosResponse> => {
    try {
      const response = await axios.put(`${config.apiUrl}/users/`, userData);
      return response;
    } catch (error: any) {
      return error;
    }
  },
}
