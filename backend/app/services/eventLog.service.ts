import { EventLog } from "../models/eventLog.model";

export const eventLogService = {
    async getEventLogs() {
        const eventLogs = await EventLog.find();
        return eventLogs;
    },
    async getEventLogById(eventLogId: string) {
        const eventLog = await EventLog.findById(eventLogId);
        if (!eventLog) {
            throw new Error("Event log not found");
        }
        return eventLog;
    },
    async addEventLog(eventLogData: any) {
        const newEventLog = new EventLog(eventLogData);
        await newEventLog.save();
        return newEventLog;
    },
    async updateEventLog(eventLogId: string, eventLogData: any) {
        const updatedEventLog = await EventLog.findByIdAndUpdate(eventLogId, eventLogData, { new: true });
        if (!updatedEventLog) {
            throw new Error("Event log not found");
        }
        return updatedEventLog;
    },
    async deleteEventLog(eventLogId: string) {
        const deletedEventLog = await EventLog.findByIdAndDelete(eventLogId);
        if (!deletedEventLog) {
            throw new Error("Event log not found");
        }
        return deletedEventLog;
    },
    async acknowledgeEventLog(eventLogId: string) {
        const acknowledgedEventLog = await EventLog.findByIdAndUpdate(eventLogId, { acknowledged: true }, { new: true });
        if (!acknowledgedEventLog) {
            throw new Error("Event log not found");
        }
        return acknowledgedEventLog;
    },  
};