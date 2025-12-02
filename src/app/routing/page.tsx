"use client"
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from 'react-map-gl/maplibre'
import RoutingSideBar from '@/components/routingsidebar';

export default function Routing() {
    return (
        <div className="h-full flex flex-row">
            <RoutingSideBar></RoutingSideBar>
            <Map
                initialViewState={{
                    longitude: -122.4,
                    latitude: 37.8,
                    zoom: 14
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="https://demotiles.maplibre.org/globe.json"
            ></Map>
        </div>

    )
}