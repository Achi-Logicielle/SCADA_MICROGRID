```mermaid
graph TB
    subgraph "SCADA Frontend"
        UI[User Interface]
        WS[WebSocket Client]
        UI --> WS
    end

    subgraph "SCADA Backend"
        API[API Server]
        DB[(Database)]
        API --> DB
    end

    subgraph "Demand-Response Module"
        OPT[Optimization Engine]
        CMD[Command Processor]
        OPT --> CMD
    end

    subgraph "Surveillance Module"
        IDS[Intrusion Detection]
        LOG[Event Logger]
        IDS --> LOG
    end

    subgraph "Message Broker"
        MQTT[MQTT Broker]
        AUTH[Authentication]
        MQTT --> AUTH
    end

    subgraph "External Systems"
        GRID[Grid Interface]
        BAT[Battery System]
        SENS[Sensors]
    end

    %% Connections
    WS --> API
    API --> MQTT
    OPT --> MQTT
    IDS --> MQTT
    MQTT --> GRID
    MQTT --> BAT
    MQTT --> SENS

    %% Data Flow
    classDef module fill:#f9f,stroke:#333,stroke-width:2px
    classDef external fill:#bbf,stroke:#333,stroke-width:2px
    classDef broker fill:#bfb,stroke:#333,stroke-width:2px

    class UI,API,OPT,IDS module
    class GRID,BAT,SENS external
    class MQTT,AUTH broker
```

## System Components

### 1. SCADA Frontend
- User Interface: Real-time monitoring and control
- WebSocket Client: Real-time data updates

### 2. SCADA Backend
- API Server: Request handling and processing
- Database: State persistence and historical data

### 3. Demand-Response Module
- Optimization Engine: Load and cost optimization
- Command Processor: Device control and management

### 4. Surveillance Module
- Intrusion Detection: Security monitoring
- Event Logger: System activity tracking

### 5. Message Broker
- MQTT Broker: Message routing and delivery
- Authentication: Security and access control

### 6. External Systems
- Grid Interface: Utility grid interaction
- Battery System: Energy storage management
- Sensors: Real-time data collection 