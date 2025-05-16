import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchDevices = async () => {
  const response = await axios.get(`${API_URL}/devices`);
  return response.data;
};

export const fetchDeviceById = async (id: string) => {
  const response = await axios.get(`${API_URL}/devices/${id}`);
  return response.data;
};

export const addDevice = async (deviceData: any) => {
  const response = await axios.post(`${API_URL}/devices`, deviceData);
  return response.data;
};

export const updateDevice = async (id: string, deviceData: any) => {
  const response = await axios.put(`${API_URL}/devices/${id}`, deviceData);
  return response.data;
};

export const deleteDevice = async (id: string) => {
  const response = await axios.delete(`${API_URL}/devices/${id}`);
  return response.data;
};