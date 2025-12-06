"use client"
import { useConfig } from "@/components/configprovider";
import MultiSelectPopup from "@/components/multiselectpopup";
import { FeatureCollection, GeoJsonObject, GeoJsonProperties, Geometry } from "geojson";
import { Feature, GeoJSONFeature, LngLat, MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, RefObject, useContext, useRef, useState } from "react";
import RoutingMap from "./map";
import { MapRef } from "react-map-gl/maplibre";



export const mapContext = createContext<{ map: RefObject<MapRef>, data: FeatureCollection }>({} as never)

export default function RoutingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const hekinavConfig = useConfig()
    const mapRef = useRef<MapRef>({} as never)

    return (
        <div className="h-full max-h-screen flex flex-row">
            <mapContext.Provider value={{ map: mapRef, data: { type: "FeatureCollection", features: [] } }}>
                {children}
                <RoutingMap></RoutingMap>
            </mapContext.Provider>

        </div>
    );
}
// 💀
export function getPageUrlFromStopIdWithoutPrefix(id: string, terminalId?: string) {
    return `/routing/${terminalId ? "station" : "stop"}/HSL:${terminalId || id}/departures`
}
export enum StopType {
    STOP = "stop",
    STATION = "station"
}