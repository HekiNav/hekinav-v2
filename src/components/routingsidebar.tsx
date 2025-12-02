import InputField, { Suggestion } from './inputfield'
import { faLocationDot, faQuestion } from '@fortawesome/free-solid-svg-icons'

export default function RoutingSideBar() {
    const generateSuggestions = getAutocomplete
    return (
        <div className="p-4 min-w-80 w-3/10">
            <InputField icon={faLocationDot} suggestionFunction={generateSuggestions}></InputField>
        </div>
    )
}
export async function getAutocomplete(text: string): Promise<Suggestion[]> {
    const response = await fetch(`/routing/autocomplete?query=${text}`)
    const { data, error }: { data: GeoJSON.FeatureCollection, error?: string } = await response.json()
    if (error) throw new Error(error)
    if (!data.features) return []
    return data.features.map((f: GeoJSON.Feature) => ({
        id: f.properties?.gid,
        text: f.properties?.label,
        icon: getIconTypeForAutocomplete(f.properties || {})
    }))
}
export function getIconTypeForAutocomplete({ layer, ...props }: { [key: string]: unknown }) {
    switch (layer) {
        case "address":
            return faLocationDot
        default:
            console.log(layer)
            return faQuestion
    }
}