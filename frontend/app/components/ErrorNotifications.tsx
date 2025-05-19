'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ErrorEvent {
    id: string;
    device_id: string;
    timestamp: string;
    event_type: string;
    message: string;
}

export default function ErrorNotifications() {
    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('connect', () => {
            console.log('Connected to surveillance module');
        });

        socket.on('error_event', (error: ErrorEvent) => {
            toast.error(
                <div>
                    <h4>Error Alert</h4>
                    <p>Device: {error.device_id}</p>
                    <p>Type: {error.event_type}</p>
                    <p>Message: {error.message}</p>
                    <p>Time: {new Date(error.timestamp).toLocaleString()}</p>
                </div>,
                {
                    position: "top-right",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: true,
                    onClick: () => {
                        socket.emit('acknowledge_error', { errorId: error.id });
                        toast.dismiss();
                    }
                }
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <ToastContainer
            position="top-right"
            autoClose={false}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
        />
    );
} 