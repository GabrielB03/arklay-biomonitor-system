import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { BOW_DESCRIPTIONS } from '../constants/bowData';

const INITIAL_SPECIMENS = [
    "Zombie", "Crimson Head", "Cerberus (MA-39)", "Hunter Alpha (MA-121)", 
    "Neptune (FI-03)", "Chimera", "Web Spinner", "Black Tiger", 
    "Wasp", "Crow", "Adder", "Yawn", "Plant 42", "Tyrant (T-002)"
];

const MonitoringDashboard = () => {
    const [specimens, setSpecimens] = useState(() => 
        INITIAL_SPECIMENS.reduce((acc, type) => ({
            ...acc,
            [type]: { type, heartRate: 0, mutationIndex: 0, threatLevel: 'STABLE' }
        }), {})
    );

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5001/monitoring-hub")
            .withAutomaticReconnect()
            .build();

        connection.on("UpdateBiometrics", (data) => {
            setSpecimens(prev => {
                const targetKey = Object.keys(prev).find(key => {
                    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const cleanIncoming = data.type.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return cleanKey === cleanIncoming;
                });

                if (!targetKey) return prev;

                return {
                    ...prev,
                    [targetKey]: {
                        ...prev[targetKey],
                        ...data,
                        heartRate: data.heartRate,
                        mutationIndex: data.mutationIndex
                    }
                };
            });
        });

        connection.start()
            .then(() => connection.invoke("SubscribeToSector", "Mansion-Labs"))
            .catch(err => console.error(err));

        return () => connection.stop();
    }, []);

    return (
        <div style={styles.dashboard}>
            <header style={styles.header}>
                <div style={styles.brand}>
                    <img src="/assets/umbrella-logo.png" style={styles.logo} alt="Umbrella" />
                    <h1 style={styles.title}>UMBRELLA <span style={{fontWeight: 100}}>BIO-MONITOR</span></h1>
                </div>
                <div style={styles.status}>FACILITY: ARKLAY LABORATORY | MONITORING ACTIVE</div>
            </header>

            <div style={styles.grid}>
                {INITIAL_SPECIMENS.map(type => {
                    const s = specimens[type];
                    const imgName = type.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');

                    return (
                        <div key={type} style={s.threatLevel === 'EXTREME' || s.heartRate > 150 ? styles.cardExtreme : styles.card}>
                            <h2 style={styles.name}>{type.toUpperCase()}</h2>
                            <div style={styles.content}>
                                <div style={styles.imageBox}>
                                    <img 
                                        src={`/assets/bows/${imgName}.png`} 
                                        style={styles.image} 
                                        alt={type}
                                        onError={(e) => { e.target.src = '/assets/bows/placeholder.png'; }}
                                    />
                                </div>
                                <div style={styles.bio}>
                                    <p style={styles.desc}>{BOW_DESCRIPTIONS[type] || "Classified."}</p>
                                </div>
                            </div>
                            <div style={styles.footer}>
                                <div style={styles.stat}>
                                    <span style={styles.label}>HEART RATE</span>
                                    <span style={s.heartRate > 100 ? styles.valAlert : styles.val}>
                                        {s.heartRate} <small>BPM</small>
                                    </span>
                                </div>
                                <div style={styles.stat}>
                                    <span style={styles.label}>MUTATION INDEX</span>
                                    <span style={styles.val}>
                                        {(s.mutationIndex * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    dashboard: { backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' },
    header: { borderBottom: '2px solid #D32F2F', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' },
    brand: { display: 'flex', alignItems: 'center', gap: '15px' },
    logo: { width: '45px', height: '45px', objectFit: 'contain' },
    title: { letterSpacing: '4px', color: '#D32F2F', margin: 0, fontSize: '28px' },
    status: { color: '#00ff00', fontSize: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#0d0d0d', border: '1px solid #222', padding: '15px', display: 'flex', flexDirection: 'column' },
    cardExtreme: { backgroundColor: '#1a0000', border: '1px solid #D32F2F', padding: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 0 15px rgba(211, 47, 47, 0.4)' },
    name: { margin: '0 0 12px 0', fontSize: '18px', color: '#D32F2F', borderBottom: '1px solid #333', paddingBottom: '6px' },
    content: { display: 'flex', gap: '15px', marginBottom: '15px', flex: 1 },
    imageBox: { width: '110px', height: '110px', backgroundColor: '#000', border: '1px solid #222', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: '100%', objectFit: 'contain' },
    bio: { flex: 1 },
    desc: { fontSize: '12px', color: '#ccc', margin: 0, lineHeight: '1.5', textAlign: 'justify' },
    footer: { borderTop: '1px solid #333', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' },
    stat: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '10px', color: '#666', marginBottom: '2px' },
    val: { fontSize: '16px', fontWeight: 'bold', color: '#fff' },
    valAlert: { fontSize: '16px', fontWeight: 'bold', color: '#ff0000' }
};

export default MonitoringDashboard;