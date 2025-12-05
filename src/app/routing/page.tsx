"use client"
import 'maplibre-gl/dist/maplibre-gl.css';
import RoutingSideBar from '@/components/routingsidebar';
import { useContext } from 'react';

import { mapContext } from './layout';

export default function RoutingContent() {
    const mapRef = useContext(mapContext)
    return (
        <>
            <RoutingSideBar map={mapRef}></RoutingSideBar>
        </>
    )
}