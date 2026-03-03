using Microsoft.AspNetCore.SignalR;

namespace Umbrella.Server.Hubs
{
    public class MonitoringHub : Hub
    {
        public async Task SubscribeToSector(string sector)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sector);
        }
    }
}