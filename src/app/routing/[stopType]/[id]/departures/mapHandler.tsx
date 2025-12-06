"use client"
import { useContext } from "react";
import { Stop } from "./page";
import { mapContext } from "@/app/routing/layout";
import { GeoJSONSource, Popup } from "maplibre-gl";

export default function StopOnMap({ stop }: { stop: Stop }) {
    let mapC = useContext(mapContext)
    const map = mapC.map.current.getMap();

    (map.getSource("temp-data") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    type: "stop",
                },
                geometry: {
                    type: "Point",
                    coordinates: [stop.lon,stop.lat]
                }
            }
        ]
    })

    return (<></>)
}