"use client"
import { useConfig } from "@/components/configprovider";
import MultiSelectPopup from "@/components/multiselectpopup";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, RefObject, useRef, useState } from "react";
import Map, { LngLat, MapGeoJSONFeature, MapMouseEvent, MapRef} from "react-map-gl/maplibre";

export const mapContext = createContext<RefObject<MapRef>>({} as never)

export default function RoutingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const hekinavConfig = useConfig()
    const mapRef = useRef<MapRef>({} as never)

    const nav = useRouter()

    const [popup, setPopup] = useState<ReactNode>()

    function onMapReady() {
        mapRef.current.off("click", "stops_case", onFeatureClick)
        mapRef.current.off("click", "stops_rail_case", onFeatureClick)
        mapRef.current.off("click", "stops_rail_case", onFeatureClick)

        mapRef.current.on("click", "stops_case", onFeatureClick)
        mapRef.current.on("click", "stops_rail_case", onFeatureClick)
    }

    function showStopSelectionPopup(feats: MapGeoJSONFeature[], pos: LngLat) {
        setPopup(
            <MultiSelectPopup onClick={(feat) => {
                nav.push(getPageUrlFromStopIdWithoutPrefix(feat.properties.stopId))
                setPopup(null)
            }} pos={pos} items={feats}></MultiSelectPopup>
        )
    }
    function onFeatureClick(e: MapMouseEvent) {
        const padding = 5;

        const box: [[number, number], [number, number]] = [
            [e.point.x - padding, e.point.y - padding],
            [e.point.x + padding, e.point.y + padding]
        ]

        const features = mapRef.current.queryRenderedFeatures(box, {
            layers: ["stops_case", "stops_rail_case"]
        })
        console.log(features.length)
        if (features.length > 1) {
            showStopSelectionPopup(features, e.lngLat)
        } else if (features.length == 1) {
            console.log("GOING TO STOPS PAGE")
            nav.push(getPageUrlFromStopIdWithoutPrefix(features[0].properties.stopId))
        }

    }

    return (
        <div className="h-full max-h-full flex flex-row">
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
            >
                {popup}
            </Map>
        </div>
    );
}
// 💀
export function getPageUrlFromStopIdWithoutPrefix(id: string) {
    return `/routing/stop/HSL:${id}/departures`
}