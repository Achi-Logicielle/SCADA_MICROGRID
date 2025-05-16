import mongoose from 'mongoose';
import Device from './models/device.model';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sample SCADA devices data
const sampleDevices = [
  {
    device_id: 'SCADA-001',
    type: 'RTU',
    model: 'Siemens SIMATIC RTU3030',
    firmware_version: 'v2.5.1',
    status: 'active',
    location: 'Substation A',
    configuration: {
      sampling_interval_sec: 5,
      calibration_date: '2023-10-15',
    },
  },
  {
    device_id: 'SCADA-002',
    type: 'PLC',
    model: 'Allen-Bradley ControlLogix',
    firmware_version: 'v3.0.0',
    status: 'active',
    location: 'Power Plant B',
    configuration: {
      sampling_interval_sec: 2,
      calibration_date: '2023-09-20',
    },
  },
  {
    device_id: 'SCADA-003',
    type: 'IED',
    model: 'GE Multilin 869',
    firmware_version: 'v1.8.3',
    status: 'maintenance',
    location: 'Transformer Yard',
    configuration: {
      sampling_interval_sec: 10,
      calibration_date: '2023-11-05',
    },
  },
  {
    device_id: 'SCADA-004',
    type: 'HMI',
    model: 'Schneider Electric Magelis',
    firmware_version: 'v4.2.0',
    status: 'inactive',
    location: 'Control Room',
    configuration: {
      sampling_interval_sec: 1,
      calibration_date: '2023-08-12',
    },
  },
  {
    device_id: 'SCADA-005',
    type: 'Sensor',
    model: 'ABB Temperature Sensor',
    firmware_version: 'v1.0.0',
    status: 'active',
    location: 'Boiler Room',
    configuration: {
      sampling_interval_sec: 30,
      calibration_date: '2023-12-01',
    },
  },
];

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/scada_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional)
    await Device.deleteMany({});
    console.log('Cleared existing devices');

    // Insert sample data
    await Device.insertMany(sampleDevices);
    console.log('Database seeded successfully!');

    // Close connection
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();