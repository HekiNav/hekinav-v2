"use client"
import { Stop } from "./page";
import { GeoJSONSource } from "maplibre-gl";
import { useMap } from "react-map-gl/maplibre";

export default function StopOnMap({ stop }: { stop: Stop }) {

    const {map} = useMap()!
    console.log(stop)
    const color = getColor(stop.routes.map(r => r.type));

    if(!map) return <>MAP NOT FOUND</>

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
    if (types.some(t => t == 701)) return "bg-blue-500"
    else if (types.some(t => t == 700)) return "bg-blue-500"
    else if (types.some(t => t == 702)) return "bg-orange-500"
    else if (types.some(t => t == 1)) return "bg-orange-500"
    else if (types.some(t => t == 109)) return "bg-purple-600"
    else if (types.some(t => t == 4)) return "bg-cyan-600"
    else if (types.some(t => t == 705)) return "bg-blue-800"
    else if (types.some(t => t == 704)) return "bg-blue-500"
    else if (types.some(t => t == 0)) return "bg-green-600"
    else if (types.some(t => t == 900)) return "bg-teal-600"
    else return "bg-teal-600"
}