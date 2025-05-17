import dotenv from 'dotenv';
import indexRoutes from './routers/index.route';
import connectDB from './models/db';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import mqtt, { MqttClient } from 'mqtt';
import cors from '@fastify/cors';
import { inAppChannelService } from './services/notifications.service';

dotenv.config();

const app = Fastify({ logger: true });

interface LastMessage {
  topic: string;
  message: any;
  receivedAt: string;
}

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
});


let lastMessages: LastMessage[] = [];
const MAX_STORED_MESSAGES = 50;

const mqttClient: MqttClient = mqtt.connect('mqtt://localhost:1883', {
  clientId: `fastify-mqtt-bridge-${Math.random().toString(16).substr(2, 8)}`
});

mqttClient.on('connect', () => {
  fastify.log.info('Connected to MQTT broker');
  mqttClient.subscribe('iot/#');
  fastify.log.info('Subscribed to iot/# topic');
});

mqttClient.on('error', (error: Error) => {
  fastify.log.error(`MQTT error: ${error.message}`);
});

mqttClient.on('message', (topic: string, payload: Buffer) => {
  try {
    const message = JSON.parse(payload.toString());
    fastify.log.info(`Received message on topic ${topic}`);
    inAppChannelService.sendNotification({
      requestId: 1,
      timestamp: new Date().toISOString(),
      notificationType: 'mqtt',
      channels: ['in-app'],
      broadcast: true,
      recipient: [],
      message: {
        subject: 'MQTT Message',
        body: JSON.stringify(message),
        pushNotification: {
          title: 'MQTT Notification',
          body: JSON.stringify(message)
        }
      },
      metadata: {
        priority: 'normal',
        retries: 3
      }
    }); 
    lastMessages.unshift({
      topic,
      message,
      receivedAt: new Date().toISOString()
    });

    if (lastMessages.length > MAX_STORED_MESSAGES) {
      lastMessages = lastMessages.slice(0, MAX_STORED_MESSAGES);
    }
  } catch (err: any) {
    fastify.log.error(`Failed to parse message: ${err.message}`);
  }
});

fastify.get('/health', async (_request: FastifyRequest, _reply: FastifyReply) => {
  return { status: 'ok', mqttConnected: mqttClient.connected };
});

fastify.get('/api/messages', async (_request: FastifyRequest, _reply: FastifyReply) => {
  return lastMessages;
});

fastify.get('/api/events', (request: FastifyRequest, reply: FastifyReply) => {
  // @ts-ignore
  reply.sse({ event: 'connected', data: { status: 'Connected to event stream' } });

  lastMessages.forEach(msg => {
    // @ts-ignore
    reply.sse({
      event: 'message',
      data: msg
    });
  });

  const messageHandler = (topic: string, payload: Buffer) => {
    try {
      const message = JSON.parse(payload.toString());
      // @ts-ignore
      reply.sse({
        event: 'message',
        data: {
          topic,
          message,
          receivedAt: new Date().toISOString()
        }
      });
    } catch (err: any) {
      fastify.log.error(`Failed to send SSE: ${err.message}`);
    }
  };

  mqttClient.on('message', messageHandler);

  request.raw.on('close', () => {
    mqttClient.removeListener('message', messageHandler);
    fastify.log.info('Client disconnected from SSE');
  });
});
app.register(indexRoutes, { prefix: '/' });

const start = async () => {
    try{
      connectDB();
      app.register(require('@fastify/cors'), {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      });
    await app.listen({ port: 3001 });
    const address = app.server.address();
    if (typeof address === 'string') {
        app.log.info(`Server listening on ${address}`);
    } else if (address && typeof address === 'object') {
        app.log.info(`Server listening on port ${address.port}`);
    } else {
        app.log.info('Server listening on unknown address');
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
