import { config } from '@/config';
import axios, { AxiosResponse } from 'axios';
import { CreateIncident } from '@/schemas/incidentschema';

export const incidentService = {
  // Method to get all incidents
  getEntities: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/incidents`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },
  
  getEntity: async (id:number): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/incidents/${id}`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },
  
  getByPriority: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/incidents/priority`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getRecents: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/incidents/recent`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getAssetWithMostIncidents: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/incidents/asset`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getAssigneeWithMostResolvedIncidents: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/incidents/assignee`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  // Method to delete a incident by ID
  deleteEntity: async (incidentId: number): Promise<AxiosResponse> => {
    try {
      const response = await axios.delete(`${config.apiUrl}/incidents/${incidentId}`);
      return response; // Handle the response data (e.g., confirmation of deletion)
    } catch (error: any) {
      return error;
    }
  },

  postIncident: async (incidentData: CreateIncident): Promise<AxiosResponse> => {
    try {
      const {status, resolvedAt, ...data} = incidentData;
      const response = await axios.post(`${config.apiUrl}/incidents`, data);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  // Method to update an existing incident
  putIncident: async (id:number, incidentData: CreateIncident): Promise<AxiosResponse> => {
    try {
      const response = await axios.put(`${config.apiUrl}/incidents/`, {
        ...incidentData, 
        updatedAt: new Date().toISOString(),
        resolvedAt: incidentData.resolvedAt ? incidentData.resolvedAt.toISOString() : undefined,
        id,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  },
}