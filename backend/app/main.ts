import dotenv from 'dotenv';
import fastify from 'fastify';
import indexRoutes from './routers/index.route';
import connectDB from './models/db';

dotenv.config();

const app = fastify({ logger: true });


app.register(indexRoutes, { prefix: '/' });

const start = async () => {
    try{
      connectDB();
      app.register(require('@fastify/cors'), {
        origin: '*',
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
