import { config } from '@/config';
import axios, { AxiosResponse } from 'axios';
import { CreateKnowledgeArticle } from '@/schemas/knowledgearticlesschema';

export const knowledgearticleService = {
  // Method to get all incidents
  getEntities: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/knowledgearticles`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getByCategory: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/knowledgearticles/category`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getRecents: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/knowledgearticles/recent`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getUserWithMostArticles: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/knowledgearticles/creator`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getAssetWithMostArticles: async (): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/knowledgearticles/asset`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  getEntity: async (id:number): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(`${config.apiUrl}/knowledgearticles/${id}`);
      return response; // Handle the response data
    } catch (error: any) {
      return error;
    }
  },

  // Method to delete a incident by ID
  deleteEntity: async (knowledgearticleDataId: number): Promise<AxiosResponse> => {
    try {
      const response = await axios.delete(`${config.apiUrl}/knowledgearticles/${knowledgearticleDataId}`);
      return response; // Handle the response data (e.g., confirmation of deletion)
    } catch (error: any) {
      return error;
    }
  },

  postKnowledgearticle: async (knowledgearticleData: CreateKnowledgeArticle, docUrl:string): Promise<AxiosResponse> => {
    try {
      console.log(docUrl, 'docUrl');      
      const response = await axios.post(`${config.apiUrl}/knowledgearticles`, {...knowledgearticleData, docUrl});
      return response;
    } catch (error: any) {
      return error;
    }
  },

  // Method to update an existing incident
  putKnowledgearticle: async (id:number, knowledgearticleData: CreateKnowledgeArticle, docUrl:string): Promise<AxiosResponse> => {
    try {
      const response = await axios.put(`${config.apiUrl}/knowledgearticles/`, {
        ...knowledgearticleData, 
        updatedAt: new Date().toISOString(),
        docUrl: docUrl,
        id,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  },
}