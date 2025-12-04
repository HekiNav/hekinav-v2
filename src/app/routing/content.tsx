"use client"
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { MapRef } from 'react-map-gl/maplibre'
import RoutingSideBar from '@/components/routingsidebar';
import { useRef } from 'react';

export interface RoutingContentProps {
    mapStyle: string //url
}

export default function RoutingContent({mapStyle}: RoutingContentProps) {
    const mapRef = useRef<MapRef>()
    return (
        <div className="h-full flex flex-row">
            <RoutingSideBar map={mapRef}></RoutingSideBar>
            <Map
                ref={mapRef}
                initialViewState={{
                    latitude: 60.170833,
                    longitude: 24.9375,
                    zoom: 10
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle={mapStyle}
            ></Map>
        </div>

    )
}