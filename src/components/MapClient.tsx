"use client";

import { useState, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox Token (Can be overridden in .env.local via NEXT_PUBLIC_MAPBOX_TOKEN)
// This is a generic test token. Users should replace this!
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN_HERE";

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

    return (
        <div style={{ height: "600px", width: "100%", borderRadius: "20px", overflow: "hidden", position: "relative", border: "1px solid var(--glass-border)" }}>
            {validDispensaries.length === 0 && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface)", zIndex: 10 }}>
                    <p>No geographic data available natively. Run the scraper first!</p>
                </div>
            )}

            {/* Mapbox component. The 'dark-v11' style fits the app aesthetic nicely. */}
            {MAPBOX_TOKEN === "YOUR_MAPBOX_TOKEN_HERE" && (
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '8px', zIndex: 100, fontSize: '12px', color: '#ffcc00' }}>
                    ⚠️ Using dummy Mapbox Token. View may be rate-limited. Update in .env.local
                </div>
            )}

            <Map
                initialViewState={{
                    latitude: 42.279, // Ann Arbor, MI default focus
                    longitude: -83.743,
                    zoom: 12,
                    bearing: 0,
                    pitch: 45
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
            >
                {validDispensaries.map(dispensary => (
                    <Marker
                        key={dispensary.id}
                        latitude={dispensary.latitude!}
                        longitude={dispensary.longitude!}
                        anchor="bottom"
                        onClick={e => {
                            e.originalEvent.stopPropagation();
                            setPopupInfo(dispensary);
                        }}
                    >
                        <div style={{
                            background: dispensary.verified ? "var(--color-primary)" : "var(--color-text-muted)",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: dispensary.verified ? "0 0 15px var(--color-primary-glow)" : "none",
                            border: "3px solid var(--color-surface)"
                        }}>
                            🌿
                        </div>
                    </Marker>
                ))}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={popupInfo.longitude!}
                        latitude={popupInfo.latitude!}
                        onClose={() => setPopupInfo(null)}
                        closeOnClick={false}
                    >
                        <div style={{ color: "#1a1d24", minWidth: "200px", padding: '5px' }}>
                            <h4 style={{ margin: "0 0 5px 0", fontSize: '16px', fontWeight: 'bold' }}>{popupInfo.name}</h4>
                            <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: '#666' }}>{popupInfo.address}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                <span style={{ fontSize: "10px", background: "#f0f0f0", padding: "3px 6px", borderRadius: "10px", fontWeight: 'bold' }}>
                                    Lic: {popupInfo.licenseNumber}
                                </span>

                                {popupInfo.verified && (
                                    <span style={{ fontSize: "10px", color: "green", fontWeight: "bold" }}>⚡ Verified</span>
                                )}
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}
