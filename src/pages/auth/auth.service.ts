import { config } from '@/config';
import axios, { AxiosResponse } from 'axios';

interface LoginDto {
  email: string;
  password: string;
}

export const loginPostReq = async (loginDto: LoginDto): Promise<AxiosResponse> => {
  try {
    // console.log(config.apiUrl, 'config.apiUrl');
    
    const response = await axios.post(`${config.apiUrl}/auth/login`, loginDto);
    return response; // Handle the response data
  } catch (error: any) {
    return error;
  }
};
