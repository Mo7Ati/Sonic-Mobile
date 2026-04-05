import type { Section } from '@/components/home/types';
import api, { ApiResponse } from './api';


export async function getHomeSections(): Promise<Section[]> {
  const { data } = await api.get<ApiResponse<Section[]>>('/home');
  return data.data;
}
