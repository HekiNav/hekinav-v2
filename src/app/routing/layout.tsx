"use client"
import { useConfig } from "@/components/configprovider";
import MultiSelectPopup from "@/components/multiselectpopup";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, RefObject, useRef, useState } from "react";
import Map, { LngLat, MapGeoJSONFeature, MapMouseEvent, MapRef } from "react-map-gl/maplibre";

export const mapContext = createContext<RefObject<MapRef>>({} as never)

export default function RoutingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const hekinavConfig = useConfig()
    const mapRef = useRef<MapRef>({} as never)

    const nav = useRouter()
    const [popups, setPopups] = useState<ReactNode[]>([])

    const layers = ["stops_case", "stops_rail_case", "stops_hub", "stops_rail_hub"]

    function onMapReady() {
        mapRef.current.off("click", onFeatureClick)
        mapRef.current.on("click", onFeatureClick)
    }

    function showStopSelectionPopup(feats: MapGeoJSONFeature[], pos: LngLat) {

        setPopups([...popups,
        <MultiSelectPopup key={popups.length} onClick={(feat) => {
            nav.push(getPageUrlFromStopIdWithoutPrefix(feat.properties.stopId, feat.properties.terminalId == feat.properties.stopId && feat.properties.terminalId));
        }} items={feats} pos={pos}></MultiSelectPopup>
        ])
    }
    function onFeatureClick(e: MapMouseEvent) {
        const padding = 5;

        const box: [[number, number], [number, number]] = [
            [e.point.x - padding, e.point.y - padding],
            [e.point.x + padding, e.point.y + padding]
        ]

        const features = mapRef.current.queryRenderedFeatures(box, {
            layers: layers
        })
        if (features.length > 1) {
            showStopSelectionPopup(features, e.lngLat)
        } else if (features.length == 1) {
            nav.push(getPageUrlFromStopIdWithoutPrefix(features[0].properties.stopId, features[0].properties.terminalId))
        }

    }

    return (
        <div className="h-full max-h-screen flex flex-row">
            <mapContext.Provider value={mapRef}>
                {children}
            </mapContext.Provider>
            <Map
                ref={mapRef}
                onRender={onMapReady}
                initialViewState={{
                    latitude: 60.170833,
                    longitude: 24.9375,
                    zoom: 10
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle={hekinavConfig.mapStyle}
            > {popups}
            </Map>
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