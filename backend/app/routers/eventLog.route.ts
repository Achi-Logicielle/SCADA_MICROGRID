import { FastifyInstance } from "fastify";
import {
    getEventLogsHandler,
    getEventLogByIdHandler,
    addEventLogHandler,
    updateEventLogHandler,
    deleteEventLogHandler,
    acknowledgeEventLogHandler,
} from "../handlers/eventLog.handler";

export async function eventLogRoutes(fastify: FastifyInstance) {
    fastify.get("/event-logs", getEventLogsHandler);
    fastify.get("/event-logs/:id", getEventLogByIdHandler);
    fastify.post("/event-logs", addEventLogHandler);
    fastify.put("/event-logs/:id", updateEventLogHandler);
    fastify.delete("/event-logs/:id", deleteEventLogHandler);
    fastify.put("/event-logs/:id/acknowledge", acknowledgeEventLogHandler);
}