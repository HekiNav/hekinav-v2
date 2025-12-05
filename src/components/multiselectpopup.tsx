import { LngLat, MapGeoJSONFeature, Popup } from "react-map-gl/maplibre";
import IconItem from "./iconitem";
import { faBusAlt, faLocationDot, faPlane, faSailboat, faTrain, faTrainSubway, faTrainTram } from "@fortawesome/free-solid-svg-icons";
import Label from "./label";

export interface MultiSelectPopupProps {
    pos: LngLat,
    items: MapGeoJSONFeature[]
    onClick: (item: MapGeoJSONFeature) => void
}

export default function MultiSelectPopup({ pos, items, onClick }: MultiSelectPopupProps) {
    console.log(items)
    return (
        <Popup latitude={pos.lat} longitude={pos.lng}>
            <div className="flex flex-col gap-2 font-narrow text-lg">
                {...items.map((e, i) =>
                    <div onClick={() => onClick(e)} key={`multi-select-popup-item-${i}`}>
                        <IconItem icon={getIcon(e.properties.mode)}>
                            <Label>{e.properties.shortId}</Label>{e.properties.nameFi}
                        </IconItem>
                    </div>

                )}
            </div>

        </Popup>
    )
}
function getIcon(type: string) {
    switch (type) {
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
        case "L_RAIL":
            return { icon: faTrainTram, className: "text-teal-600" }
        default:
            console.warn("No icon for station/stop of type", type)
            return { icon: faLocationDot, className: "text-stone-600" }
    }
}