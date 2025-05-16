import { FastifyInstance } from 'fastify';
import devicesRoutes from './devices.route';
// Register routers
export default async function indexRoutes(fastify: FastifyInstance) {
    fastify.register(devicesRoutes, { prefix: '/devices' });
}
