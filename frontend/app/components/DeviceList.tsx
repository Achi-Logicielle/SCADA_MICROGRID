"use client";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { fetchDevices } from "../api/devices";

interface Device {
  _id: string;
  device_id: string;
  type: string;
  model: string;
  firmware_version: string;
  status: string;
  location: string;
  registration_date: string;
  configuration: {
    sampling_interval_sec: number;
    calibration_date: string;
  };
  __v?: number;
}

const DeviceList = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        setLoading(true);
        const data = await fetchDevices();
        if (!data) {
          throw new Error("No data received");
        }
        setDevices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch devices");
        console.error("Error fetching devices:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, []);

  const columns: GridColDef<Device>[] = [
    { field: "device_id", headerName: "Device ID", width: 150 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "model", headerName: "Model", width: 200 },
    { field: "firmware_version", headerName: "Firmware Version", width: 150 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "registration_date", headerName: "Registration Date", width: 100 },
    {
      field: "configuration",
      headerName: "Configuration",
      width: 200,
      valueGetter: (params:any) => {
        const config = params;
        console.log("Configuration:", params);
        return `Interval: ${config.sampling_interval_sec}s, Calibration: ${config.calibration_date}`;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <strong>
          <a href={`/devices/${params.row._id}`}>View</a>
        </strong>
      ),
    },
  ];

  if (loading) return <div>Loading devices...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!devices.length) return <div>No devices found</div>;

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <DataGrid
        rows={devices}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </div>
  );
};

export default DeviceList;