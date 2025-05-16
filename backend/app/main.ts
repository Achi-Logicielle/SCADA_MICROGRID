import dotenv from 'dotenv';
import fastify from 'fastify';
import indexRoutes from './routers/index.route';
const app = fastify({ logger: true });

const mongoPlugin = require('./plugins/mongo.ts');
app.register(mongoPlugin, {
  MONGO_URI: process.env.MONGO_URI || '',
});

app.register(indexRoutes, { prefix: '/' });

const start = async () => {
    try{
    await app.listen({ port: 3000 });
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
