import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eventLogService } from "../services/eventLog.service";

export async function getEventLogsHandler(request: FastifyRequest<{ 
}>, reply: FastifyReply) {
    try {
        const logs = await eventLogService.getEventLogs();
        reply.send(logs);
    } catch (err: any) {
        console.log(err);
        reply.status(500).send({ error: err.message });
    }
}

// Handler to get event log by ID
export async function getEventLogByIdHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
        const log = await eventLogService.getEventLogById(request.params.id);
        reply.send(log);
    } catch (err: any) {
        reply.status(404).send({ error: err.message });
    }
}

// Handler to add a new event log
export async function addEventLogHandler(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const newLog = await eventLogService.addEventLog(request.body);
        reply.status(201).send(newLog);
    } catch (err: any) {
        reply.status(400).send({ error: err.message });
    }
}

// Handler to update an event log
export async function updateEventLogHandler(request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    try {
        const updatedLog = await eventLogService.updateEventLog(request.params.id, request.body);
        reply.send(updatedLog);
    } catch (err: any) {
        reply.status(404).send({ error: err.message });
    }
}

// Handler to delete an event log
export async function deleteEventLogHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
        const deletedLog = await eventLogService.deleteEventLog(request.params.id);
        reply.send(deletedLog);
    } catch (err: any) {
        reply.status(404).send({ error: err.message });
    }
}

// Handler to acknowledge an event log
export async function acknowledgeEventLogHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
        const acknowledgedLog = await eventLogService.acknowledgeEventLog(request.params.id);
        reply.send(acknowledgedLog);
    } catch (err: any) {
        reply.status(404).send({ error: err.message });
    }
}