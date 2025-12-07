"use client"
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import { useMap } from "react-map-gl/maplibre";
import { RoutePattern, Route } from "@/app/routing/route/[id]/[directionId]/page";
import { decode } from "@googlemaps/polyline-codec";

export default function RouteOnMap({ route, pattern }: { route: Route, pattern: RoutePattern, depArr: string, time: string }) {

    const { map } = useMap()!
    const color = getColor(route.type);

    if (!map || !map.getSource("temp-data")) return <>MAP NOT FOUND</>

    const patternShape: [number, number][] = decode(pattern.patternGeometry.points).map(([lat, lon]) => [lon, lat])

    const bounds = patternShape.reduce((bounds, coord) => {
        return bounds.extend(coord);
    }, new maplibregl.LngLatBounds([patternShape[0], patternShape[0]]));

    map.fitBounds(bounds,{
        essential: true,
        padding: 100
    })

    ; (map.getSource("temp-data") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    type: "route-stop",
                    color: color
                },
                geometry: {
                    type: "MultiPoint",
                    coordinates: [
                        ...pattern.stops.map(s => [s.lon, s.lat])
                    ]
                }
            },
            {
                type: "Feature",
                properties: {
                    type: "route-path",
                    color: color
                },
                geometry: {
                    type: "LineString",
                    coordinates: patternShape
                }
            }
        ]
    })



    return (<></>)
}
function getColor(type: number) {
    if (type == 702) return 1
    else if (type == 701) return 0
    else if (type == 700) return 0
    else if (type == 1) return 1
    else if (type == 109) return 2
    else if (type == 4) return 3
    else if (type == 705) return 4
    else if (type == 704) return 5
    else if (type == 900) return 6
    else if (type == 0) return 7
    else return 8
}