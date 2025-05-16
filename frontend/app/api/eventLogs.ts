import axios from 'axios';

const API_URL = 'http://localhost:3001/event-logs';

export const fetchEventLogs = async () => {
    const response = await axios.get(`${API_URL}`);
    console.log('Event Logs:', response);
    return response.data;
};

export const fetchEventLogById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const addEventLog = async (eventLogData: any) => {
    const response = await axios.post(`${API_URL}`, eventLogData);
    return response.data;
};

export const updateEventLog = async (id: string, eventLogData: any) => {
    const response = await axios.put(`${API_URL}/${id}`, eventLogData);
    return response.data;
};

export const deleteEventLog = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const acknowledgeEventLog = async (id: string) => {
    const response = await axios.put(`${API_URL}/${id}/acknowledge`);
    return response.data;
}