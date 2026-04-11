import type { Section } from './home-types';
import api, { ApiResponse } from '@/lib/api';


export async function getHomeSections(): Promise<Section[]> {
  const { data } = await api.get<ApiResponse<Section[]>>('/home');
  return data.data;
}
