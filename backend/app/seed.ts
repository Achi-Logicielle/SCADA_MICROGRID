import mongoose from 'mongoose';
import { EventLog } from '../app/models/eventLog.model'; // Adjust the path if different
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/microgrid';

async function seedEventLogs() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Optional: clear the existing collection
    await EventLog.deleteMany({});
    console.log('🧹 Cleared existing event logs');

    const sampleLogs = [
      {
        device_id: 'device-001',
        timestamp: new Date('2025-05-15T10:00:00Z'),
        event_type: 'voltage_surge',
        severity: 'high',
        message: 'Voltage exceeded 260V on line A1',
      },
      {
        device_id: 'device-002',
        timestamp: new Date('2025-05-15T11:15:00Z'),
        event_type: 'temperature_warning',
        severity: 'medium',
        message: 'Inverter temperature approaching threshold',
      },
      {
        device_id: 'device-003',
        timestamp: new Date('2025-05-15T12:45:00Z'),
        event_type: 'disconnect',
        severity: 'low',
        message: 'Battery unit temporarily disconnected for maintenance',
      },
    ];

    await EventLog.insertMany(sampleLogs);
    console.log('🌱 Seeded event logs successfully');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedEventLogs();
