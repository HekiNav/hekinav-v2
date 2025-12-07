import { ReactNode, useContext, useState } from "react"
import { getPageUrlFromStopIdWithoutPrefix, mapContext } from "./layout"
import Map, { Layer, LngLat, MapGeoJSONFeature, MapMouseEvent, Source, useMap } from "react-map-gl/maplibre";
import { useConfig } from "@/components/configprovider";
import MultiSelectPopup from "@/components/multiselectpopup";
import { useRouter } from "next/navigation";

export default function RoutingMap() {
    const { data } = useContext(mapContext)
    const { map } = useMap()!

    const hekinavConfig = useConfig()


    const [popups, setPopups] = useState<ReactNode[]>([])

    const nav = useRouter()

    const layers = ["stops_case", "stops_rail_case", "stops_hub", "stops_rail_hub"]

    function onMapLoad() {
        if (!map) return
        map.off("click", onFeatureClick)
        map.on("click", onFeatureClick)
    }


    function showStopSelectionPopup(feats: MapGeoJSONFeature[], pos: LngLat) {

        setPopups([...popups,
        <MultiSelectPopup key={popups.length} onClick={(feat) => {
            nav.push(getPageUrlFromStopIdWithoutPrefix(feat.properties.stopId, feat.properties.terminalId == feat.properties.stopId && feat.properties.terminalId));
        }} items={feats} pos={pos}></MultiSelectPopup>
        ])
    }
    function onFeatureClick(e: MapMouseEvent) {
        const padding = 5;

        const box: [[number, number], [number, number]] = [
            [e.point.x - padding, e.point.y - padding],
            [e.point.x + padding, e.point.y + padding]
        ]
        if (!map) return
        const features = map.queryRenderedFeatures(box, {
            layers: layers
        })
        if (features.length > 1) {
            showStopSelectionPopup(features, e.lngLat)
        } else if (features.length == 1) {
            nav.push(getPageUrlFromStopIdWithoutPrefix(features[0].properties.stopId, features[0].properties.terminalId))
        }

    }
    //const [tempData, setTempData] = useState()
    const layerStyle = {
        paint: {
            "circle-radius": 10,
            "circle-stroke-color": [
                'interpolate', ['linear'], ["get","color"],
                0,
                "#3b82f6",
                1,
                "#f97316",
                2,
                "#9333ea",
                3,
                "#0891b2",
                4,
                "#1e40af",
                5,
                "#3b82f6",
                6,
                "#0d9488",
                7,
                "#16a34a",
                8,
                "#000",
            ],
            "circle-color": "white",
            "circle-stroke-width": 8
        }
    };
    return (
        <Map
            onLoad={onMapLoad}
            onRender={onMapLoad}
            id="map"
            initialViewState={{
                latitude: 60.170833,
                longitude: 24.9375,
                zoom: 10
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={hekinavConfig.mapStyle}
        > {popups}
            <Source id="temp-data" type="geojson" data={data || { type: "Feature", geometry: { type: "Point", coordinates: [25, 60] } }}>
                <Layer source="temp-data" type="circle" filter={["==", ["get", "type"], "stop"]} id="temp-stop" {...layerStyle}></Layer>
            </Source>
        </Map>
    )
}