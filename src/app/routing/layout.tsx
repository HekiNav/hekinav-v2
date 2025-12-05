"use client"
import { useConfig } from "@/components/configprovider";
import MultiSelectPopupContent from "@/components/multiselectpopup";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, RefObject, useRef, useState } from "react";
import Map, { LngLat, MapGeoJSONFeature, MapMouseEvent, MapRef, Popup } from "react-map-gl/maplibre";

export const mapContext = createContext<RefObject<MapRef>>({} as never)

export default function RoutingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const hekinavConfig = useConfig()
    const mapRef = useRef<MapRef>({} as never)

    const nav = useRouter()
    const popupRef = useRef<maplibregl.Popup>({} as never)
    const [popupContent, setPopupContent] = useState<ReactNode>(<div></div>)

    const layers = ["stops_case", "stops_rail_case", "stops_hub", "stops_rail_hub"]

    function onMapReady() {
        mapRef.current.off("click", onFeatureClick)
        mapRef.current.on("click", onFeatureClick)
    }

    function showStopSelectionPopup(feats: MapGeoJSONFeature[], pos: LngLat) {
        if (!popupRef.current.isOpen()) popupRef.current.fire("click")
        //popupRef.current.setLngLat(pos)
        setPopupContent(
            <MultiSelectPopupContent onClick={(feat) => {
                nav.push(getPageUrlFromStopIdWithoutPrefix(feat.properties.stopId, feat.properties.terminalId))
            }} items={feats}></MultiSelectPopupContent>
        )
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
        console.log(features.length)
        if (features.length > 1) {
            showStopSelectionPopup(features, e.lngLat)
        } else if (features.length == 1) {
            console.log("GOING TO STOPS PAGE", features[0])
            nav.push(getPageUrlFromStopIdWithoutPrefix(features[0].properties.stopId, features[0].properties.terminalId))
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
            > <Popup ref={popupRef} latitude={0} longitude={0}>
                {popupContent}
            </Popup>
            </Map>
        </div>
    );
}
// 💀
export function getPageUrlFromStopIdWithoutPrefix(id: string, terminalId?: string) {
    return `/routing/${terminalId ? "station" : "stop"}/HSL:${id}/departures`
}