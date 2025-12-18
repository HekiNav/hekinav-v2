"use client"
import { useState } from 'react'
import InputField, { Suggestion } from './inputfield'
import { faBicycle, faBusAlt, faLocationDot, faParking, faPlane, faQuestion, faRoad, faSailboat, faStoreAlt, faTrain, faTrainSubway, faTrainTram } from '@fortawesome/free-solid-svg-icons'
import { useMap } from 'react-map-gl/maplibre'
import RoutingTimeInput from './routingtimeinput'
import { IEndStartPoint } from '@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/api/route'
import { useRouter } from 'next/navigation'
import { GeoJSONSource, LngLatBounds } from 'maplibre-gl'

export interface RoutingSearchProps {
    destination?: IEndStartPoint,
    origin?: IEndStartPoint,
    time?: number,
    depArr?: DepArr
}
export enum DepArr {
    DEP,
    ARR
}

export default function RoutingSearch(props: RoutingSearchProps) {
    const generateSuggestions = getAutocomplete
    const [origin, setOrigin] = useState<IEndStartPoint | null>(props.origin || null)
    const [destination, setDestination] = useState<IEndStartPoint | null>(props.destination || null)
    const [time, setTime] = useState<number>(props.time || 0)
    const [depArr, setDepArr] = useState<DepArr>(props.depArr || DepArr.DEP)

    const { map } = useMap()
    const nav = useRouter()

    function onValueSet(name: string, value: Suggestion) {
        if (name == "origin") {
            setOrigin({
                location: {
                    coordinate: {
                        latitude: value.properties.lon,
                        longitude: value.properties.lat
                    },
                },
                label: value.text
            })
        } else if (name == "destination") {
            setDestination({
                location: {
                    coordinate: {
                        latitude: value.properties.lon,
                        longitude: value.properties.lat
                    },
                },
                label: value.text
            })
        }
        const suggestion = value as Suggestion
        const center: [number, number] = [suggestion.properties?.lat, suggestion.properties?.lon]
        const originCenter: [number, number] | null = name == "origin" ? center : (origin ? [origin?.location?.coordinate.longitude || 0, origin?.location?.coordinate.latitude || 0] : null)
        const destinationCenter: [number, number] | null = name == "destination" ? center : (destination ? [destination?.location?.coordinate.longitude || 0, destination?.location?.coordinate.latitude || 0] : null)

        if (!map || !map.getSource("temp-data")) return;

        interface fooba {
            type: "Feature",
            properties: { [key: string]: string },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            geometry: any
        }
        const feats = new Array<fooba>()

        if (originCenter) feats.push({
            type: "Feature",
            properties: {
                type: "origin-marker"
            },
            geometry: {
                type: "Point",
                coordinates: originCenter
            }
        });

        if (destinationCenter) feats.push({
            type: "Feature",
            properties: {
                type: "destination-marker"
            },
            geometry: {
                type: "Point",
                coordinates: destinationCenter
            }
        })


        let bounds = new LngLatBounds(center, center)

        if (originCenter) bounds = bounds.extend(originCenter)
        if (destinationCenter) bounds = bounds.extend(destinationCenter)

        if (originCenter && destinationCenter) map.fitBounds(bounds, {
            padding: 100,
            duration: 5000,
            animate: true,
            essential: true
        })
        else map.easeTo({
            center: center,
            zoom: 13,
            essential: true
        })

            ; (map.getSource("temp-data") as GeoJSONSource).setData({
                type: "FeatureCollection",
                features: feats
            })

    }
    function search() {
        if (!origin || !destination) {
            alert("Please select a valid destination and origin")
            return
        }
        const url = `/routing/itinerary/${encodeURIComponent(JSON.stringify(origin))}/${encodeURIComponent(JSON.stringify(destination))}/${time}/${depArr == 0 ? "dep" : "arr"}/options/`
        nav.push(url)
    }
    return (
        <div>
            <InputField placeholder='Origin' initialValue={origin?.label} icon={{ icon: faLocationDot, className: "text-green-500" }} name="origin" onValueSet={(name: string, value: unknown) => onValueSet(name, value as Suggestion)} suggestionFunction={generateSuggestions}></InputField>
            <div className='m-2'></div>
            <InputField placeholder='Destination' initialValue={destination?.label} icon={{ icon: faLocationDot, className: "text-pink-500" }} name="destination" onValueSet={(name: string, value: unknown) => onValueSet(name, value as Suggestion)} suggestionFunction={generateSuggestions}></InputField>
            <RoutingTimeInput initialTime={time} initialDepArr={depArr} onDepArrSet={setDepArr} onTimeSet={setTime}></RoutingTimeInput>
            <button className='border-2 w-full p-2 hover:border-blue-500 hover:text-blue-500' onClick={search}>Search</button>
        </div>
    )
}
export async function getAutocomplete(text: string): Promise<Suggestion[]> {
    const response = await fetch(`/routing/autocomplete?query=${text}`)
    const { data, error }: { data: GeoJSON.FeatureCollection, error?: string } = await response.json()
    if (error) throw new Error(error)
    if (!data.features) return []
    const addressProprties = ["neighbourhood", "locality", "localadmin"]
    return data.features.map((f: GeoJSON.Feature) => ({
        id: f.properties?.gid,
        text: f.properties?.name,
        icon: getIconTypeForAutocomplete(f.properties || {}),
        desc: addressProprties.reduce((prev, key) => {
            const value = f.properties && f.properties[key]
            if (value && prev.split(", ").findLast(() => true) != value) return `${prev}${prev.length ? ", " : ""}${value}`
            return prev
        }, ""),
        properties: {
            lat: (f.geometry as GeoJSON.Point).coordinates[0],
            lon: (f.geometry as GeoJSON.Point).coordinates[1]
        }
    }))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getIconTypeForAutocomplete({ layer, ...props }: { [key: string]: any }) {
    switch (layer) {
        case "address":
            return { icon: faLocationDot, className: "text-stone-600" }
        case "bikestation":
            return { icon: faBicycle, className: "text-stone-600" }
        case "bikepark":
            return { icon: faBicycle, className: "text-yellow-600" }
        case "venue":
            return { icon: faStoreAlt, className: "text-stone-600" }
        case "street":
            return { icon: faRoad, className: "text-stone-600" }
        case "carpark":
            return { icon: faParking, className: "text-stone-600" }
        case "stop":
        case "station":
            switch (props.addendum && props.addendum.GTFS.modes[0]) {
                case "BUS":
                    return { icon: faBusAlt, className: "text-blue-500" }
                case "SUBWAY":
                    return { icon: faTrainSubway, className: "text-orange-500" }
                case "RAIL":
                    return { icon: faTrain, className: "text-purple-600" }
                case "FERRY":
                    return { icon: faSailboat, className: "text-cyan-600" }
                case "AIRPLANE":
                    return { icon: faPlane, className: "text-blue-800" }
                case "TRAM":
                    return { icon: faTrainTram, className: "text-green-600" }
                case "SPEEDTRAM":
                    return { icon: faTrainTram, className: "text-teal-600" }
                default:
                    console.warn("No icon for station/stop of type", props.addendum && props.addendum.GTFS.modes[0])
                    return { icon: faLocationDot, className: "text-stone-600" }
            }
        default:
            console.warn("No icon for result from layer ", layer)
            return { icon: faQuestion, className: "text-pink-500" }
    }
}