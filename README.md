# Arklay Bio-Monitor System

## Overview

Arklay Bio-Monitor System is a high-fidelity diagnostic dashboard inspired by the Resident Evil franchise. Developed as a full-stack telemetry solution, it simulates the real-time monitoring of biological specimens (B.O.W.s) within the Arklay Research Facility. The project features a distributed architecture where a C# simulator generates biometric data, a central server processes it via gRPC, and a React frontend visualizes the results in real-time using SignalR.

## Features

- **Real-Time Biometric Telemetry**: Live tracking of Heart Rate (BPM) and Mutation Index for 14 different specimens.
- **Dynamic Threat Assessment**: Visual alerts and card styling changes (red glow) when a specimen reaches "EXTREME" threat levels or critical heart rates.
- **Smart Data Mapping**: Resilient string-matching logic that synchronizes telemetry even with minor naming variations between backend and frontend.
- **Authentic UI/UX**: Industrial laboratory aesthetic featuring the Umbrella Corporation branding and specimen-specific technical descriptions.
- **Distributed Architecture**: Modular separation between the Data Simulator, the Central Hub, and the Monitoring Dashboard.

## Technologies Used

- **React (Vite)**: Modern frontend framework for high-performance data visualization.
- **.NET 10**: Powering the backend server and specimen simulators.
- **SignalR**: Used for low-latency, real-time communication between server and dashboard.
- **gRPC**: Handles the high-frequency stream of biometric data from the simulator to the hub.
- **CSS-in-JS**: Custom industrial styling for a dark-mode terminal experience.

## Instalation

1. Clone the repository:
   ```bash
   git clone https://github.com/GabrielB03/arklay-biomonitor-system.git
   ```
2. Setup the Backend:
   - Navigate to the project folder: ```cd backend/UmbrellaSystem```
   - Restore dependencies: ```dotnet restore```
   - Run the server: ```dotnet run --project Umbrella.Server```
   - Run the simulator: ```dotnet run --project Umbrella.Simulators.Arklay```
3. Setup the Frontend:
   - Open a new terminal and navigate to the folder: ```cd frontend/umbrella-dashboard```
   - Install dependencies: ```npm install```
   - Run the dashboard: ```npm run dev```

## Requirements

- .NET 8 SDK or newer
- Node.js (v18+) and npm
- C# Extension for VS Code (recommended)
- A modern web browser (Chrome/Edge recommended for SignalR performance)

## Project Preview

<img width="1600" height="644" alt="image" src="https://github.com/user-attachments/assets/a930e008-f050-4688-9c3a-badb974b3aaa" />

## Contribution

Security clearance is required for contributions:
1. Fork the repository.
2. Create a branch for your research (git checkout -b experiment-v-act).
3. Commit your changes.
4. Open a Pull Request for Oversight review.

## Future Improvements

- **Audio Integration**: Proximity-based alarms and specimen-specific sound effects.
- **Historical Logs**: A side panel tracking the history of critical mutations.
- **Security Protocols**: Implementation of an "Access Denied" screen if the server connection is lost.
- **Docker Support**: Containerizing the entire Arklay network for easy deployment.

## License

This project is licensed under the MIT license - see the [LICENSE](LICENSE) file for details.
