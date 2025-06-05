'use client';
import React from 'react'
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import "leaflet/dist/leaflet.css";

// Fix for marker icons in production
const icon = L.icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    center?: number[]
}

const Map: React.FC<MapProps> = ({
    center
}) => {
  return (
    <MapContainer
        center={center as L.LatLngExpression || [51, -0.09]}
        zoom={center? 4 : 2}
        scrollWheelZoom={false}
        className='h-[35vh] rounded-lg'
    >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {center && (
        <Marker
            position={center as L.LatLngExpression}
            icon={icon}
        />
    )}

    </MapContainer>
  )
}

export default Map