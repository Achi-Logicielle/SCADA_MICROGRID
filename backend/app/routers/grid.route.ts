import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { mqttClient } from '../lib/mqtt';

interface BuyRequest {
  Body: {
    amount: number;
    price: number;
  };
}

interface SellRequest {
  Body: {
    amount: number;
    price: number;
  };
}

export default async function gridRoutes(fastify: FastifyInstance) {
  // Buy from grid
  fastify.post<BuyRequest>('/buy', async (request: FastifyRequest<BuyRequest>, reply: FastifyReply) => {
    try {
      const { amount, price } = request.body;
      mqttClient.publish('grid/buy/request', { amount, price });
      return reply.send({ success: true, message: 'Buy request sent' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Failed to send buy request' });
    }
  });

  // Sell to grid
  fastify.post<SellRequest>('/sell', async (request: FastifyRequest<SellRequest>, reply: FastifyReply) => {
    try {
      const { amount, price } = request.body;
      mqttClient.publish('grid/sell/request', { amount, price });
      return reply.send({ success: true, message: 'Sell request sent' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Failed to send sell request' });
    }
  });

  // Get grid status
  fastify.get('/status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      mqttClient.publish('grid/status/request', {});
      return reply.send({ success: true, message: 'Status request sent' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Failed to send status request' });
    }
  });
} 