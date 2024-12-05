import { config } from '@/config';
import axios, { AxiosResponse } from 'axios';
import { CreateAsset } from '@/schemas/assetsschema';

export const assetService = {
  // Method to get all incidents
  getEntities: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/assets`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getEntity: async (id:number): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/assets/${id}`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getByType: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/assets/type`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getRecents: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/assets/recent`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getUserWithMostAssets: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/assets/owner`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  // Method to delete a incident by ID
  deleteEntity: async (id: number): Promise<AxiosResponse> => {
    try {
      const response = await axios.delete(`${config.apiUrl}/assets/${id}`);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  postAsset: async (data: CreateAsset): Promise<AxiosResponse> => {
    try {
      console.log(data, 'asset');      
      const response = await axios.post(`${config.apiUrl}/assets`, {
        ...data, 
        purchasedAt: data.purchasedAt.toISOString(),
        warrantyExpiresAt: data.warrantyExpiresAt ? data.warrantyExpiresAt.toISOString() : null,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  },

  // Method to update an existing incident
  putAsset: async (id:number, data: CreateAsset): Promise<AxiosResponse> => {
    try {
      const response = await axios.put(`${config.apiUrl}/assets/`, {
        ...data, 
        purchasedAt: data.purchasedAt.toISOString(),
        warrantyExpiresAt: data.warrantyExpiresAt ? data.warrantyExpiresAt.toISOString() : null,
        updatedAt: new Date().toISOString(),
        id,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  },
}
