"use client";
import React, { useState } from 'react';
import DeviceList from '../components/DeviceList';
import DeviceForm from '../components/DeviceForm';
import { Button, Dialog, DialogTitle } from '@mui/material';

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h1>SCADA Device Dashboard</h1>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Device
      </Button>
      <DeviceList />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Device</DialogTitle>
        <DeviceForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </div>
  );
};

export default Dashboard;