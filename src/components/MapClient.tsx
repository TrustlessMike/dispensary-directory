"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";

// Dynamic import with SSR disabled because Leaflet depends heavily on the 'window' object
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

type Dispensary = {
    id: string;
    name: string;
    licenseNumber: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    verified: boolean;
};

export default function MapClient({ dispensaries }: { dispensaries: Dispensary[] }) {
    const [popupInfo, setPopupInfo] = useState<Dispensary | null>(null);

    // We only care about dispensaries that have valid coords for the map
    const validDispensaries = useMemo(() =>
        dispensaries.filter(d => d.latitude && d.longitude),
        [dispensaries]
    );

    // Default icon setup for Leaflet in a Next.js environment
    // Leaflet's default marker icons often get broken by Next.js bundlers. 
    // We create a custom HTML icon to match the previous aesthetic.
    const [customIcon, setCustomIcon] = useState<any>(null);

    useEffect(() => {
        // Need to import L inside useEffect since leaflet uses window
        const setupIcon = async () => {
            const L = await import('leaflet');

            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="
                        background: var(--color-primary);
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        box-shadow: 0 0 15px var(--color-primary-glow);
                        border: 3px solid var(--color-surface);
                    ">🌿</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            setCustomIcon(icon);
        };
        setupIcon();
    }, []);

    // Wait until customIcon is ready
    if (typeof window === 'undefined' || !customIcon) {
        return <div style={{ height: "600px", width: "100%", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface)", border: "1px solid var(--glass-border)" }}>Loading Map...</div>;
    }

    return (
        <div style={{ height: "600px", width: "100%", borderRadius: "20px", overflow: "hidden", position: "relative", border: "1px solid var(--glass-border)" }}>
            {validDispensaries.length === 0 && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface)", zIndex: 10 }}>
                    <p>No geographic data available natively. Run the scraper first!</p>
                </div>
            )}

            <MapContainer
                center={[42.279, -83.743]} // Ann Arbor, MI default focus
                zoom={12}
                style={{ width: "100%", height: "100%", zIndex: 1 }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {validDispensaries.map(dispensary => (
                    <Marker
                        key={dispensary.id}
                        position={[dispensary.latitude!, dispensary.longitude!]}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => {
                                setPopupInfo(dispensary);
                            },
                        }}
                    >
                        <Popup>
                            <div style={{ color: "#1a1d24", minWidth: "180px" }}>
                                <h4 style={{ margin: "0 0 5px 0", fontSize: '16px', fontWeight: 'bold' }}>{dispensary.name}</h4>
                                <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: '#666' }}>{dispensary.address}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                    <span style={{ fontSize: "10px", background: "#f0f0f0", padding: "3px 6px", borderRadius: "10px", fontWeight: 'bold' }}>
                                        Lic: {dispensary.licenseNumber}
                                    </span>

                                    {dispensary.verified && (
                                        <span style={{ fontSize: "10px", color: "green", fontWeight: "bold" }}>⚡ Verified</span>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
