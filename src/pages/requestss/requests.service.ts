import { config } from '@/config';
import axios, { AxiosResponse } from 'axios';
import { CreateRequest } from '@/schemas/requestsschema';

export const requestService = {
  // Method to get all incidents
  getEntities: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/requests`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getEntity: async (id:number): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/requests/${id}`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getByStatus: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/requests/status`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getRecents: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/requests/recent`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getRequestorWithMostRequests: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/requests/requestor`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getAssigneeWithMostResolvedRequests: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/requests/assignee`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  // Method to delete a incident by ID
  deleteEntity: async (id: number): Promise<AxiosResponse> => {
    try {
      const response = await axios.delete(`${config.apiUrl}/requests/${id}`);
      return response; // Handle the response data (e.g., confirmation of deletion)
    } catch (error: any) {
      return error;
    }
  },

  postRequest: async (requestData: CreateRequest): Promise<AxiosResponse> => {
    try {
      const {resolvedAt, status, ...data} = requestData;
      const response = await axios.post(`${config.apiUrl}/requests`, data);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  putRequest: async (id:number, data: CreateRequest): Promise<AxiosResponse> => {
    try {
      const response = await axios.put(`${config.apiUrl}/requests/`, {
        ...data, 
        updatedAt: new Date().toISOString(),
        resolvedAt: data.resolvedAt ? data.resolvedAt.toISOString() : undefined,
        id,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  },
}
