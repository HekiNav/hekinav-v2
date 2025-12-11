"use client"
import { useMap } from "react-map-gl/maplibre";
import { decode } from "@googlemaps/polyline-codec";
import { IEndStartPoint, Itinerary } from "../api/route";
import { GeoJSONSource, LngLatBounds } from "maplibre-gl";

export default function ItineraryCollectionOnMap({ itineraries, selected, origin, destination }: { itineraries: Itinerary[], selected?: number | null, origin: IEndStartPoint, destination: IEndStartPoint }) {

    const { map } = useMap()!

    const stops: GeoJSON.Feature[] = []

    function addThingsToMap() {
        if (!map || !map.getSource("temp-data")) return setTimeout(addThingsToMap, 1000)


        const patternShapes: GeoJSON.Feature[][] = itineraries.map((itinerary, index) => {
            const thisSelected = index == selected
            return itinerary.legs.map(leg => {
                const color = getColor(leg.route?.type || 1000)
                if (leg.transitLeg && thisSelected) {
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
                        type: thisSelected ? (leg.transitLeg ? "route-path" : "walk-path") : "bg-route-path",
                        color: color
                    },
                    geometry: {
                        type: "LineString",
                        coordinates: decode(leg.legGeometry.points).map(([lat, lon]) => [lon, lat])
                    }
                }
            })
        })
        const originFeat = {
            type: ("Feature" as never),
            properties: {
                type: "origin-marker"
            },
            geometry: {
                type: ("Point" as never),
                coordinates: Object.values(origin.location.coordinate).reverse()
            }
        }
        const destinationFeat = {
            type: ("Feature" as never),
            properties: {
                type: "destination-marker"
            },
            geometry: {
                type: ("Point" as never),
                coordinates: Object.values(destination.location.coordinate).reverse()
            }
        }

            ; (map.getSource("temp-data") as GeoJSONSource).setData({
                type: "FeatureCollection",
                features: [
                    ...stops,
                    ...patternShapes.flat(),
                    destinationFeat,
                    originFeat
                ]

            })
        const stopsAsPoints = ([...stops, originFeat, destinationFeat] as GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>[])
        
        const firstCoords = stopsAsPoints[0].geometry.coordinates as [number, number]
        const bounds = stopsAsPoints.reduce((prev, curr) => prev.extend(curr.geometry.coordinates as [number, number]), new LngLatBounds(firstCoords, firstCoords))
        map.fitBounds(bounds, {
            essential: true,
            padding: 100,
            duration: 2000
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