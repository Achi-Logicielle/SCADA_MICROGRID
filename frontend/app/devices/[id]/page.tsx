"use client";
import { useParams } from "next/navigation";
import { fetchDeviceById } from "../../api/devices";
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Chip, CircularProgress, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


interface Device {
  _id: string;
  device_id: string;
  type: string;
  model: string;
  firmware_version: string;
  status: "active" | "inactive" | "maintenance";
  location: string;
  registration_date: string;
  configuration: {
    sampling_interval_sec: number;
    calibration_date: string;
  };
}

export default function DeviceDetail() {
  const params = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDevice = async () => {
      try {
        setLoading(true);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) throw new Error("Invalid device ID");
        
        const data = await fetchDeviceById(id);
        setDevice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load device");
      } finally {
        setLoading(false);
      }
    };

    loadDevice();
  }, [params.id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!device) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Device not found
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Device Details
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            {device.model}
          </Typography>
          <Chip 
            label={device.status.toUpperCase()} 
            color={
              device.status === "active" ? "success" : 
              device.status === "maintenance" ? "warning" : "error"
            } 
          />
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3}>
          <DetailItem label="Device ID" value={device.device_id} />
          <DetailItem label="Type" value={device.type} />
          <DetailItem label="Firmware Version" value={device.firmware_version} />
          <DetailItem label="Location" value={device.location} />
          <DetailItem 
            label="Registration Date" 
            value={dayjs(device.registration_date).format("MMMM D, YYYY")} 
          />
          <DetailItem 
            label="Sampling Interval" 
            value={`${device.configuration.sampling_interval_sec} seconds`} 
          />
          <DatePicker
            label="Calibration Date"
            value={dayjs(device.configuration.calibration_date)}
            readOnly
            sx={{ gridColumn: "span 1" }}
          />
        </Box>
      </Paper>

      {/* Additional sections can be added here */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Advanced Configuration
        </Typography>
        <Typography variant="body1">
          Additional device-specific settings and parameters would be displayed here.
        </Typography>
      </Paper>
    </Box>
    </LocalizationProvider>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}