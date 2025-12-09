"use client"
import { FeatureCollection } from "geojson";
import { createContext } from "react";
import RoutingMap from "./map";
import { MapProvider } from "react-map-gl/maplibre";
import Icon from "@/components/icon";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";



export const mapContext = createContext<{ data: FeatureCollection }>({} as never)

export default function RoutingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const nav = useRouter()
    return (
        <MapProvider>
            <div className="h-full max-h-screen flex flex-row">
                <mapContext.Provider value={{ data: { type: "FeatureCollection", features: [] } }}>
                    <div className="flex flex-col">
                        <div className="w-full flex flex-row cursor-pointer" onClick={nav.back}>
                            <Icon icon={faCaretLeft}></Icon> Back
                        </div>
                        {children}
                    </div>
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