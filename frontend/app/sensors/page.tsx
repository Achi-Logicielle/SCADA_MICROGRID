'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

interface SensorReading {
  timestamp: string;
  value: number;
  unit: string;
}

interface SensorMessage {
  gateway_id: string;
  sensor_id: string;
  sensor_type: string;
  location: string;
  reading: SensorReading;
}

export default function SensorEventsPage() {
  const [messages, setMessages] = useState<SensorMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [error, setError] = useState<string | null>(null);
  const [mqttLogs, setMqttLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setMqttLogs(prev => [log, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    // We need to explicitly use websockets protocol for browser clients
    const options = {
      protocol: 'ws',
      clientId: 'mqtt-nextjs-' + Math.random().toString(16).substring(2, 8),
      // The below options may be needed depending on your broker
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
    };

    console.log('Attempting to connect to MQTT broker...');
    const client = mqtt.connect('ws://localhost:9001');
    
    client.on('connect', () => {
      setConnectionStatus('Connected');
      setError(null);
      addLog('✅ Connected to MQTT broker');
      
      // Subscribe exactly as the Python publisher is broadcasting
      client.subscribe('iot/#');
      addLog('📩 Subscribed to topic: iot/#');
    });

    client.on('error', (err) => {
      console.error('❌ MQTT Connection error:', err);
      setConnectionStatus('Error');
      setError(`Connection error: ${err.message}`);
      addLog(`❌ Error: ${err.message}`);
    });

    client.on('reconnect', () => {
      setConnectionStatus('Reconnecting');
      addLog('♻️ Attempting to reconnect...');
    });

    client.on('message', (topic, payload) => {
      const payloadStr = payload.toString();
      addLog(`📩 Received on ${topic}: ${payloadStr.substring(0, 30)}...`);
      
      try {
        const message: SensorMessage = JSON.parse(payloadStr);
        setMessages(prev => {
          // Check if we already have this exact message to avoid duplicates
          const isDuplicate = prev.some(m => 
            m.gateway_id === message.gateway_id &&
            m.sensor_id === message.sensor_id &&
            m.reading.timestamp === message.reading.timestamp
          );
          
          if (isDuplicate) return prev;
          return [message, ...prev.slice(0, 19)];
        });
      } catch (err) {
        console.error('❌ Failed to parse MQTT message:', err);
        addLog(`❌ Parse error: ${err instanceof Error ? err.message : String(err)}`);
      }
    });

    return () => {
      addLog('Disconnecting MQTT client...');
      client.end();
    };
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Live Sensor Events</h1>
      
      <div className={`mb-4 p-3 border rounded ${
        connectionStatus === 'Connected' ? 'bg-green-50 border-green-200' : 
        connectionStatus === 'Error' ? 'bg-red-50 border-red-200' : 
        'bg-yellow-50 border-yellow-200'
      }`}>
        <div><strong>Status:</strong> {connectionStatus}</div>
        {error && <div className="text-red-600">{error}</div>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-medium mb-2">Sensor Data</h2>
          {messages.length === 0 ? (
            <div className="text-gray-500 italic p-4 border rounded border-gray-200">
              Waiting for sensor data...
            </div>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg, i) => (
                <li key={`${msg.gateway_id}-${msg.sensor_id}-${msg.reading.timestamp}`} 
                    className="border border-gray-300 rounded p-4 shadow">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold">{msg.sensor_type}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                      {msg.reading.value} {msg.reading.unit}
                    </span>
                  </div>
                  <div><strong>Sensor:</strong> {msg.sensor_id}</div>
                  <div><strong>Gateway:</strong> {msg.gateway_id}</div>
                  <div><strong>Location:</strong> {msg.location}</div>
                  <div><strong>Time:</strong> {new Date(msg.reading.timestamp).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-2">Connection Logs</h2>
          <div className="border rounded border-gray-300 bg-gray-50 p-2 font-mono text-sm h-64 overflow-y-auto">
            {mqttLogs.map((log, i) => (
              <div key={i} className="border-b border-gray-200 pb-1 mb-1 last:border-0">
                {log}
              </div>
            ))}
            {mqttLogs.length === 0 && (
              <div className="text-gray-500 italic">No connection logs yet</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}