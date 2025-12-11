"use client"
import { useMap } from "react-map-gl/maplibre";
import { decode } from "@googlemaps/polyline-codec";
import { Itinerary } from "../../api/route";
import { GeoJSONSource } from "maplibre-gl";

export default function ItineraryOnMap({ itinerary }: { itinerary: Itinerary }) {


    const { map } = useMap()!

    const stops: GeoJSON.Feature[] = []

    function addThingsToMap() {
        if (!map || !map.getSource("temp-data")) return setTimeout(addThingsToMap, 1000)
        const patternShapes: GeoJSON.Feature[] = itinerary.legs.map(leg => {
            const color = getColor(leg.route?.type || 1000)
            if (leg.transitLeg) {
                stops.push(...([leg.to, leg.from].map(p => ({
                    type: ("Feature" as never),
                    properties: {
                        type: "route-stop",
                        color: color
                    },
                    geometry: {
                        type: ("Point" as never),
                        coordinates: [
                            p.stop?.lon || 0, p.stop?.lat || 0
                        ]
                    }
                }))))
            }
            console.log(stops)
            return {
                type: "Feature",
                properties: {
                    type: leg.transitLeg ? "route-path" : "walk-path",
                    color: color
                },
                geometry: {
                    type: "LineString",
                    coordinates: decode(leg.legGeometry.points).map(([lat, lon]) => [lon, lat])
                }
            }
        })


            ; (map.getSource("temp-data") as GeoJSONSource).setData({
                type: "FeatureCollection",
                features: [
                    ...stops,
                    ...patternShapes
                ]

            })
    }
    addThingsToMap()
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