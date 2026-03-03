using Grpc.Net.Client;
using Umbrella.Shared.Protos;

var channel = GrpcChannel.ForAddress("http://localhost:5000");
var client = new BiometryMonitor.BiometryMonitorClient(channel);
using var stream = client.StreamBiometrics();

var profiles = new[]
{
    (Type: "Zombie", MinHR: 10, MaxHR: 45, Behavior: "Infectado/Lento"),
    (Type: "Crimson Head", MinHR: 90, MaxHR: 160, Behavior: "V-ACT/Rápido"),
    (Type: "Cerberus (MA-39)", MinHR: 80, MaxHR: 160, Behavior: "Ataque em Grupo"),
    (Type: "Hunter Alpha (MA-121)", MinHR: 120, MaxHR: 200, Behavior: "Saltador/Letal"),
    (Type: "Neptune (FI-03)", MinHR: 60, MaxHR: 110, Behavior: "Aquático"),
    (Type: "Chimera", MinHR: 130, MaxHR: 210, Behavior: "Teto/Rápido"),
    (Type: "Web Spinner", MinHR: 40, MaxHR: 85, Behavior: "Aranha/T-Virus"),
    (Type: "Black Tiger", MinHR: 45, MaxHR: 95, Behavior: "Aranha Gigante"),
    (Type: "Wasp", MinHR: 15, MaxHR: 60, Behavior: "Voador/Veneno"),
    (Type: "Crow", MinHR: 20, MaxHR: 70, Behavior: "Aves Infectadas"),
    (Type: "Adder", MinHR: 30, MaxHR: 80, Behavior: "Serpente/Veneno"),
    (Type: "Yawn", MinHR: 50, MaxHR: 100, Behavior: "Cobra Gigante"),
    (Type: "Plant 42", MinHR: 0, MaxHR: 20, Behavior: "Tentáculos/Ácido"),
    (Type: "Tyrant (T-002)", MinHR: 40, MaxHR: 260, Behavior: "Arma Suprema")
};

var rnd = new Random();

while (true)
{
    var p = profiles[rnd.Next(profiles.Length)];

    await stream.RequestStream.WriteAsync(new BiometricRequest
    {
        SpecimenId = $"ARK-{p.Type[..3].ToUpper().Replace(" ", "")}-{rnd.Next(100, 999)}",
        SpecimenType = p.Type,
        HeartRate = rnd.Next(p.MinHR, p.MaxHR),
        MutationIndex = rnd.NextDouble(),
        Sector = "Mansion-Labs",
        BehaviorMode = p.Behavior
    });

    Console.WriteLine($"[TRANSMITTING] {p.Type} | HR: {rnd.Next(p.MinHR, p.MaxHR)}");
    await Task.Delay(800);
}