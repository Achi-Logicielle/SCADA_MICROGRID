import mqtt, { MqttClient, IClientOptions } from 'mqtt';

class MQTTClient {
  private client: MqttClient | null = null;
  private static instance: MQTTClient;

  private constructor() {
    this.connect();
  }

  public static getInstance(): MQTTClient {
    if (!MQTTClient.instance) {
      MQTTClient.instance = new MQTTClient();
    }
    return MQTTClient.instance;
  }

  private connect() {
    const options: IClientOptions = {
      clientId: `scada-frontend-${Math.random().toString(16).slice(3)}`,
      username: 'admin',
      password: '$7$101$2KWvl9zHpWaYgcbG$ONaSwiDXEcN1o46BQ68QfRHOZeQZzn7lqf3XqGvNtM6oMVvvKFRh0uFLOUl96KDInyNhZS8vYIyN5KPZI5k1Cg==',
      clean: true,
      reconnectPeriod: 1000
    };

    this.client = mqtt.connect('ws://localhost:9001', options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    this.client.on('error', (error: Error) => {
      console.error('MQTT Error:', error);
    });

    this.client.on('close', () => {
      console.log('MQTT connection closed');
    });
  }

  public publish(topic: string, message: any) {
    if (!this.client?.connected) {
      console.error('MQTT client not connected');
      return;
    }
    this.client.publish(topic, JSON.stringify(message));
  }

  public subscribe(topic: string, callback: (message: any) => void) {
    if (!this.client?.connected) {
      console.error('MQTT client not connected');
      return;
    }
    this.client.subscribe(topic);
    this.client.on('message', (receivedTopic: string, message: Buffer) => {
      if (receivedTopic === topic) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          callback(parsedMessage);
        } catch (error) {
          console.error('Error parsing MQTT message:', error);
        }
      }
    });
  }

  public disconnect() {
    if (this.client?.connected) {
      this.client.end();
    }
  }
}

export const mqttClient = MQTTClient.getInstance(); 