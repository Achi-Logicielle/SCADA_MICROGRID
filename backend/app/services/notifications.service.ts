
import { activeConnections } from "../handlers/websocket.handler";
import { WebSocket } from "ws";

export interface NotificationPayload {
    requestId: number;
    timestamp: string;
    notificationType: string;
    channels: Array<"email" | "push" | "in-app">;
    broadcast: boolean;
    recipient: Array<{
        userId: number;
        email: string;
    }>;
    message: {
        subject: string;
        body: string;
        attachments?: string[];
        pushNotification?: {
            title: string;
            body: string;
            icon?: string;
            action?: {
                type: string;
                url: string;
            };
        };
    };
    schedule?: {
        sendAt: string;
    };
    metadata?: {
        priority: "low" | "normal" | "high";
        retries: number;
    };
}


export const inAppChannelService={
    async  sendNotification(notification: NotificationPayload) {
        const notificationMessage = JSON.stringify({
            type: "notification",
            data: notification,
            timestamp: new Date().toISOString()
        });
        activeConnections.forEach((connection, connectionId) => {
            // Skip if connection is not open
            if (connection.socket.readyState !== WebSocket.OPEN) {
                activeConnections.delete(connectionId);
                return;
            }
            // Determine if this connection should receive the notification
            const shouldReceive = 
                // If it's a broadcast notification, send to everyone
                notification.broadcast ||
                // If no specific recipients or topics, send to everyone
                (!notification.recipient?.length && !notification.notificationType) ||
                // Check if any recipient matches the connection's user_id
                notification.recipient?.some(recipient => Number(connection.user_id) === Number(recipient.userId)
            
        );
            console.log(shouldReceive)
            if (shouldReceive) {
                try {
                    console.log(`Sending notification to ${connectionId}:`, notificationMessage);
                    connection.socket.send(notificationMessage);
                } catch (err) {
                    console.error(`Failed to send notification to ${connectionId}:`, err);
                    activeConnections.delete(connectionId);
                }
            }
        });
    }
}

