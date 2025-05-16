export interface EventLog {
    _id?: string;
    timestamp: Date;
    event_type: 'alarm' | 'status' | 'command' | 'system';
    severity: 'critical' | 'warning' | 'info';
    device_id: string;
    message: string;
    acknowledged: boolean;
    metadata?: Record<string, any>;
}