using Grpc.Core;
using Microsoft.AspNetCore.SignalR;
using Umbrella.Shared.Protos;
using Umbrella.Server.Hubs;

namespace Umbrella.Server.Services
{
    public class BiometryService : BiometryMonitor.BiometryMonitorBase
    {
        private readonly IHubContext<MonitoringHub> _hubContext;

        public BiometryService(IHubContext<MonitoringHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public override async Task<BiometricResponse> StreamBiometrics(
            IAsyncStreamReader<BiometricRequest> requestStream,
            ServerCallContext context)
        {
            await foreach (var entry in requestStream.ReadAllAsync())
            {
                var processedType = entry.SpecimenType;

                if (entry.SpecimenType == "Zombie" && entry.HeartRate > 80)
                {
                    processedType = "Crimson Head (V-ACT Process)";
                }

                var threat = CalculateThreat(processedType, entry.MutationIndex);

                Console.WriteLine($"[ANALYSIS] {processedType} | Sector: {entry.Sector} | Threat: {threat}");

                await _hubContext.Clients.Group(entry.Sector).SendAsync("UpdateBiometrics", new
                {
                    SpecimenId = entry.SpecimenId,
                    Type = processedType,
                    entry.HeartRate,
                    entry.MutationIndex,
                    entry.BehaviorMode,
                    ThreatLevel = threat
                });
            }
            return new BiometricResponse { Acknowledged = true };
        }

        private string CalculateThreat(string type, double mutation)
        {
            if (type.Contains("Tyrant") || type.Contains("Yawn")) return "EXTREME";
            if (type.Contains("Crimson") || type.Contains("Hunter") || type.Contains("Chimera")) return "HIGH";
            return "MODERATE";
        }
    }
}