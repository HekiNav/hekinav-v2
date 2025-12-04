"use client"
import { RefObject, useState } from 'react'
import InputField, { Suggestion } from './inputfield'
import { faBicycle, faBusAlt, faLocationDot, faPlane, faQuestion, faRoad, faSailboat, faStoreAlt, faTrain, faTrainSubway, faTrainTram } from '@fortawesome/free-solid-svg-icons'
import { MapRef } from 'react-map-gl/maplibre'
import RoutingTimeInput from './routingtimeinput'

export interface RoutingSideBarProps {
    map?: RefObject<MapRef>
}

export default function RoutingSideBar(props: RoutingSideBarProps) {
    const generateSuggestions = getAutocomplete
    const [origin, setOrigin] = useState<Suggestion | null>(null)
    const [destination, setDestination] = useState<Suggestion | null>(null)
    function onValueSet<T = Suggestion>(name: string, value: T) {
        if (name == "origin") {
            setOrigin(value as Suggestion)
        } else if (name == "destination") {
            setDestination(value as Suggestion)
        }
        console.log(value)
        const suggestion = value as Suggestion
        const center: [number, number] = [suggestion.properties?.lat, suggestion.properties?.lon]
        props.map?.current.flyTo({
            center: center,
            zoom: 11
        })
        if ((origin || (name == "origin" && value)) && (destination || (name == "destination" && value))) {
            console.log("ROUTING HAPPENS HERE")
        }
    }
    return (
        <div className="p-4 min-w-80 w-4/10">
            <h1 className='font-bold font-rounded text-xl mb-2'>Where to?</h1>
            <InputField placeholder='Origin' icon={{ icon: faLocationDot, className: "text-green-500" }} name="origin" onValueSet={onValueSet} suggestionFunction={generateSuggestions}></InputField>
            <div className='m-2'></div>
            <InputField placeholder='Destination' icon={{ icon: faLocationDot, className: "text-pink-500" }} name="destination" onValueSet={onValueSet} suggestionFunction={generateSuggestions}></InputField>
            <RoutingTimeInput></RoutingTimeInput>
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
            return { icon: faBicycle, className: "text-stone-600"  }
        case "bikepark":
            return { icon: faBicycle, className: "text-yellow-600" }
        case "venue":
            return { icon: faStoreAlt, className: "text-stone-600"  }
        case "street":
            return { icon: faRoad, className: "text-stone-600" }
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
                    return { icon: faTrainTram, className: "text-green-600"}
                case "SPEEDTRAM":
                    return { icon: faTrainTram, className: "text-teal-600"}
                default:
                    console.warn("No icon for station/stop of type", props.addendum && props.addendum.GTFS.modes[0])
                    return { icon: faLocationDot, className: "text-stone-600" }
            }
        default:
            console.warn("No icon for result from layer ", layer)
            return { icon: faQuestion, className: "text-pink-500" }
    }
}