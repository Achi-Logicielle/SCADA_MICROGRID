import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchDevices, deleteDevice } from '../api/devices';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const DeviceList = () => {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    const loadDevices = async () => {
      const data = await fetchDevices();
      setDevices(data);
    };
    loadDevices();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDevice(id);
    setDevices(devices.filter(device => device.id !== id));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Device Name', width: 200 },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => console.log('Edit', params.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.id as string)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={devices} columns={columns} />
    </div>
  );
};

export default DeviceList;