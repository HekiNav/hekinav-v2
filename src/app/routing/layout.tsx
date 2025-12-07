"use client"
import { FeatureCollection } from "geojson";
import { createContext } from "react";
import RoutingMap from "./map";
import { MapProvider } from "react-map-gl/maplibre";



export const mapContext = createContext<{ data: FeatureCollection }>({} as never)

export default function RoutingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <MapProvider>
            <div className="h-full max-h-screen flex flex-row">
                <mapContext.Provider value={{ data: { type: "FeatureCollection", features: [] } }}>
                    {children}
                    <RoutingMap></RoutingMap>
                </mapContext.Provider>

            </div>
        </MapProvider>

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