"use client";
import React, { useState, useEffect } from 'react';
import { fetchEventLogs, acknowledgeEventLog, deleteEventLog } from '../api/eventLogs';
import { EventLog } from '../types/eventLog';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button
} from '@mui/material';
import {
  CheckCircle as AcknowledgeIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const EventLogsPage = () => {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<EventLog[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, tabValue, searchTerm]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchEventLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let result = [...logs];
    
    // Filter by tab selection
    if (tabValue === 1) result = result.filter(log => !log.acknowledged);
    if (tabValue === 2) result = result.filter(log => log.severity === 'critical');
    if (tabValue === 3) result = result.filter(log => log.severity === 'warning');
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.message.toLowerCase().includes(term) ||
        log.device_id.toLowerCase().includes(term) ||
        log.event_type.toLowerCase().includes(term)
    );
    }
    setFilteredLogs(result);
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeEventLog(id);
      loadLogs();
    } catch (error) {
      console.error('Error acknowledging log:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEventLog(id);
      loadLogs();
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return <InfoIcon color="info" />;
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Event Logs
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All" />
          <Tab label="Unacknowledged" />
          <Tab label="Critical" />
          <Tab label="Warnings" />
        </Tabs>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 1 }}
          />
          <Button onClick={loadLogs} variant="outlined">
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No logs found</TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={log.event_type} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getSeverityIcon(log.severity)}
                      <span style={{ marginLeft: 8 }}>{log.severity}</span>
                    </Box>
                  </TableCell>
                  <TableCell>{log.device_id}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>
                    {log.acknowledged ? (
                      <Chip label="Acknowledged" color="success" size="small" />
                    ) : (
                      <Chip label="Unacknowledged" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {!log.acknowledged && (
                      <Tooltip title="Acknowledge">
                        <IconButton onClick={() => handleAcknowledge(log._id!)}>
                          <AcknowledgeIcon color="success" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(log._id!)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EventLogsPage;