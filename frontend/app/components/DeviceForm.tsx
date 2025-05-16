import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { addDevice, updateDevice } from '../api/devices';

const DeviceForm = ({ device, onSuccess }: { device?: any; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    name: device?.name || '',
    status: device?.status || 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (device) {
      await updateDevice(device.id, formData);
    } else {
      await addDevice(formData);
    }
    onSuccess();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Device Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {device ? 'Update Device' : 'Add Device'}
      </Button>
    </Box>
  );
};

export default DeviceForm;