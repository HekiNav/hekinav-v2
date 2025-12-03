import { useState } from 'react'
import InputField, { Suggestion } from './inputfield'
import { faBicycle, faBusAlt, faLocationDot, faPlane, faQuestion, faRoad, faSailboat, faStoreAlt, faTrain, faTrainSubway, faTrainTram } from '@fortawesome/free-solid-svg-icons'

export default function RoutingSideBar() {
    const generateSuggestions = getAutocomplete
    const [origin, setOrigin] = useState<Suggestion | null>(null)
    const [destination, setDestination] = useState<Suggestion | null>(null)
    function onValueSet<T = Suggestion>(name: string, value: T) {
        if (name == "origin") {
            setOrigin(value as Suggestion)
        } else if (name == "destination") {
            setDestination(value as Suggestion)
        }
        if ((origin || (name == "origin" && value)) && (destination || (name == "destination" && value))) {
            console.log("ROUTING HAPPENS HERE")
        }
    }
    return (
        <div className="p-4 min-w-80 w-4/10">
            <InputField placeholder='Origin' icon={{ icon: faLocationDot }} name="origin" onValueSet={onValueSet} suggestionFunction={generateSuggestions}></InputField>
            <div className='m-2'></div>
            <InputField placeholder='Destination' icon={{ icon: faLocationDot }} name="destination" onValueSet={onValueSet} suggestionFunction={generateSuggestions}></InputField>
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
        }, "")
    }))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getIconTypeForAutocomplete({ layer, ...props }: { [key: string]: any }) {
    switch (layer) {
        case "address":
            return { icon: faLocationDot }
        case "bikestation":
        case "bikepark":
            return { icon: faBicycle }
        case "venue":
            return { icon: faStoreAlt }
        case "street":
            return { icon: faRoad }
        case "stop":
        case "station":
            switch (props.addendum && props.addendum.GTFS.modes[0]) {
                case "BUS":
                    return { icon: faBusAlt }
                case "SUBWAY":
                    return { icon: faTrainSubway }
                case "RAIL":
                    return { icon: faTrain }
                case "FERRY":
                    return { icon: faSailboat }
                case "AIRPLANE":
                    return { icon: faPlane }
                case "TRAM":
                case "SPEEDTRAM":
                    return { icon: faTrainTram }
                default:
                    console.warn("No icon for station/stop of type", props.addendum && props.addendum.GTFS.modes[0])
                    return { icon: faLocationDot }
            }
        default:
            console.warn("No icon for result from layer ", layer)
            return { icon: faQuestion }
    }
}