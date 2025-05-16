import Device from "../models/device.model";


export const devicesService={

    getAllDevices: async ()=>{
        try {
            const devices = await Device.find();
            return devices;
        } catch (error:any) {
            console.log("Error fetching devices:", error);
            throw new Error("Error fetching devices: " + error.message);
        }
    },
    
    getDeviceById: async (deviceId:string)=>{
        try {
            const device = await Device.findById(deviceId);
            if (!device) {
                throw new Error("Device not found");
            }   
            return device;
        } catch (error:any) {
            throw new Error("Error fetching device: " + error.message);
        }   
    },

    addDevice: async (deviceData:any)=>{
        try {
            const newDevice = new Device(deviceData);
            await newDevice.save();
            return newDevice;
        } catch (error:any) {
            throw new Error("Error adding device: " + error.message);
        }
    },
    updateDevice: async (deviceId:string, deviceData:any)=>{
        try {
            const updatedDevice = await Device.findByIdAndUpdate(deviceId, deviceData, { new: true });
            if (!updatedDevice) {
                throw new Error("Device not found");
            }
            return updatedDevice;
        } catch (error:any) {
            throw new Error("Error updating device: " + error.message);
        }
    },

    deleteDevice: async (deviceId:string)=>{
        try {
            const deletedDevice = await Device.findByIdAndDelete(deviceId);
            if (!deletedDevice) {
                throw new Error("Device not found");
            }
            return deletedDevice;
        } catch (error:any) {
            throw new Error("Error deleting device: " + error.message);
        }
    }
}