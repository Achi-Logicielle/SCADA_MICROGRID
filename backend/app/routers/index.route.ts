import { FastifyInstance } from 'fastify';
import devicesRoutes from './devices.route';
import { eventLogRoutes } from './eventLog.route';
import gridRoutes from './grid.route';
// Register routers
export default async function indexRoutes(fastify: FastifyInstance) {
    fastify.register(devicesRoutes, { prefix: '/devices' });
    fastify.register(eventLogRoutes);
    fastify.register(import('./websocket.route'));
    fastify.register(gridRoutes,{prefix : '/grid'})
}
