import { FastifyInstance, FastifyRequest } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { websocketRouteHandler } from "../handlers/websocket.handler";



export default async function websocketRoute(fastify: FastifyInstance) {
    await fastify.register(fastifyWebsocket);
    fastify.get("/ws/:user_id", { websocket: true }, (connection, req:FastifyRequest<{
        Params: { user_id: number }
    }>) => {
        websocketRouteHandler(req, connection);
    });
}
    