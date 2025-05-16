import { FastifyReply, FastifyRequest } from "fastify";
import { devicesService } from "../services/devices.service";

// Handler to get all devices
export const getAllDevicesHandler = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const devices = await devicesService.getAllDevices();
        reply.send(devices);
    } catch (error: any) {
        reply.status(500).send({ error: error.message });
    }
};

// Handler to get a device by ID
export const getDeviceByIdHandler = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const device = await devicesService.getDeviceById(request.params.id);
        reply.send(device);
    } catch (error: any) {
        reply.status(404).send({ error: error.message });
    }
};

// Handler to add a new device
export const addDeviceHandler = async (
    request: FastifyRequest<{ Body: any }>,
    reply: FastifyReply
) => {
    try {
        const newDevice = await devicesService.addDevice(request.body);
        reply.status(201).send(newDevice);
    } catch (error: any) {
        reply.status(400).send({ error: error.message });
    }
};

// Handler to update a device
export const updateDeviceHandler = async (
    request: FastifyRequest<{ Params: { id: string }; Body: any }>,
    reply: FastifyReply
) => {
    try {
        const updatedDevice = await devicesService.updateDevice(request.params.id, request.body);
        reply.send(updatedDevice);
    } catch (error: any) {
        reply.status(404).send({ error: error.message });
    }
};

// Handler to delete a device
export const deleteDeviceHandler = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const deletedDevice = await devicesService.deleteDevice(request.params.id);
        reply.send(deletedDevice);
    } catch (error: any) {
        reply.status(404).send({ error: error.message });
    }
};