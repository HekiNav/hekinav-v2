"use client"
import { Stop } from "./page";
import { GeoJSONSource } from "maplibre-gl";
import { useMap } from "react-map-gl/maplibre";

export default function StopOnMap({ stop }: { stop: Stop }) {

    const { map } = useMap()!
    console.log(stop)
    const color = getColor(stop.routes.map(r => r.type));

    if (!map || !map.getSource("temp-data")) return <>MAP NOT FOUND</>

    map.easeTo({
        essential: true,
        center: [stop.lon, stop.lat],
        zoom: 14
    });

    (map.getSource("temp-data") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    type: "stop",
                    color: color
                },
                geometry: {
                    type: "Point",
                    coordinates: [stop.lon, stop.lat]
                }
            }
        ]
    })



    return (<></>)
}
function getColor(types: number[]) {
    if (types.some(t => t == 702)) return 1
    else if (types.some(t => t == 701)) return 0
    else if (types.some(t => t == 700)) return 0
    else if (types.some(t => t == 1)) return 1
    else if (types.some(t => t == 109)) return 2
    else if (types.some(t => t == 4)) return 3
    else if (types.some(t => t == 705)) return 4
    else if (types.some(t => t == 704)) return 5
    else if (types.some(t => t == 900)) return 6
    else if (types.some(t => t == 0)) return 7
    else return 8
}