import fp from 'fastify-plugin';
import mongoose from 'mongoose';

async function mongoConnector(fastify: any, options: { MONGO_URI: string }) {
  const { MONGO_URI } = options;

  try {
    await mongoose.connect(MONGO_URI);
    fastify.decorate
    fastify.log.info('MongoDB connected');
  } catch (error) {
    fastify.log.error('MongoDB connection error:', error);
  }
}

export default fp(mongoConnector);