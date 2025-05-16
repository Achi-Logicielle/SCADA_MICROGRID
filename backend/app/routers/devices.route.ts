import { FastifyInstance } from "fastify";
import {

getAllDevicesHandler,
getDeviceByIdHandler,
addDeviceHandler,
updateDeviceHandler,
deleteDeviceHandler,
} from "../handlers/devices.handler";

export default async function devicesRoutes(fastify: FastifyInstance) {
fastify.get("/devices", getAllDevicesHandler);
fastify.get("/devices/:id", getDeviceByIdHandler);
fastify.post("/devices", addDeviceHandler);
fastify.put("/devices/:id", updateDeviceHandler);
fastify.delete("/devices/:id", deleteDeviceHandler);
}