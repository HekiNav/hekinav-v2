import InputField from './inputfield'
import { faBusAlt, faLocationDot } from '@fortawesome/free-solid-svg-icons'

export default function RoutingSideBar() {
    function generateSuggestions(text: string) {
        return [
            {text: text + " 1", id: "1", icon: faLocationDot},
            {text: text + " 2", id: "2", icon: faBusAlt}
        ]
    }
    return (
        <div className="p-4 min-w-80 w-3/10">
            <InputField icon={faLocationDot} suggestionFunction={generateSuggestions}></InputField>
        </div>
    )
}