import api from './api';
import { IVehicle } from '@types';

export const getVehicles = (): Promise<{ data: IVehicle[] }> => {
  return api.get('/vehicles');
};

export const getVehicleById = (id: string): Promise<{ data: IVehicle }> => {
  return api.get(`/vehicles/${id}`);
};

export const createVehicle = (vehicleData: Partial<IVehicle>): Promise<{ data: IVehicle }> => {
  return api.post('/vehicles', vehicleData);
};

export const updateVehicle = (
  id: string,
  updateData: Partial<IVehicle>
): Promise<{ data: IVehicle }> => {
  return api.put(`/vehicles/${id}`, updateData);
};

export const deleteVehicle = (id: string): Promise<{ data: { message: string } }> => {
  return api.delete(`/vehicles/${id}`);
};
