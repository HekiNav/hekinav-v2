"use client"
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from 'react-map-gl/maplibre'

export default function Routing() {
    return (
        <div>
            <Map
                initialViewState={{
                    longitude: -122.4,
                    latitude: 37.8,
                    zoom: 14
                }}
                style={{ width: 600, height: 400 }}
                mapStyle="https://demotiles.maplibre.org/globe.json"
            ></Map>
        </div>
    )
}