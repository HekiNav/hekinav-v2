import { ReactNode, useContext, useState } from "react"
import { getPageUrlFromStopIdWithoutPrefix, mapContext } from "./layout"
import Map, { Layer, LngLat, MapGeoJSONFeature, MapMouseEvent, Source, useMap } from "react-map-gl/maplibre";
import { useConfig } from "@/components/configprovider";
import MultiSelectPopup from "@/components/multiselectpopup";
import { useRouter } from "next/navigation";

export default function RoutingMap() {
    const { data } = useContext(mapContext)
    const { map } = useMap()

    const hekinavConfig = useConfig()


    const [popups, setPopups] = useState<ReactNode[]>([])

    const nav = useRouter()

    /* const pathname = usePathname()

    useEffect(() => {
        if (!map || !map.getSource("temp-data")) return
        (map?.getSource("temp-data") as GeoJSONSource).setData({
            type: "FeatureCollection",
            features: []
        })
    }, [pathname]) */

    const layers = ["stops_case", "stops_rail_case", "stops_hub", "stops_rail_hub"]

    function onMapLoad(a = true) {
        if (!map || !map.getSource("temp-data")) return setTimeout(onMapLoad, 1000)

        if (a) {
            map.off("click", onFeatureClick)
            map.on("click", onFeatureClick)
        }
        if (!map.getImage("map-pin-red")) {
            const imageRed = document.createElement("img")
            imageRed.src = "/map-pin-red.svg"
            imageRed.addEventListener("load", () => {
                if (!map.getImage("map-pin-red")) map.addImage("map-pin-red", imageRed)
            })
        }
        if (!map.getImage("map-pin-green")) {
            const imageGreen = document.createElement("img")
            imageGreen.src = "/map-pin-green.svg"
            imageGreen.addEventListener("load", () => {
                if (!map.getImage("map-pin-green")) map.addImage("map-pin-green", imageGreen)
            })
        }
        if (!map.getImage("vehicle-base")) {
            const imageGreen = document.createElement("img")
            imageGreen.src = "/vehicle.svg"
            imageGreen.addEventListener("load", () => {
                if (!map.getImage("vehicle-base")) map.addImage("vehicle-base", imageGreen)
            })
        }
        if (!map.getImage("vehicle-empty")) {
            const imageGreen = document.createElement("img")
            imageGreen.src = "/empty.svg"
            imageGreen.addEventListener("load", () => {
                if (!map.getImage("vehicle-empty")) map.addImage("vehicle-empty", imageGreen)
            })
        }

    }


    function showStopSelectionPopup(feats: MapGeoJSONFeature[], pos: LngLat) {
        setPopups([...popups,
        <MultiSelectPopup key={popups.length} onClick={(feat) => {
            nav.push(getPageUrlFromStopIdWithoutPrefix(feat.properties.stopId, feat.properties.terminalId == feat.properties.stopId && feat.properties.terminalId));
        }} items={feats} pos={pos}></MultiSelectPopup>
        ])
    }
    function onFeatureClick(e: MapMouseEvent) {

        const padding = 10;

        const box: [[number, number], [number, number]] = [
            [e.point.x - padding, e.point.y - padding],
            [e.point.x + padding, e.point.y + padding]
        ]
        if (!map) return console.warn("no map");
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const colorInterpolate: ["interpolate", any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] = [
        'interpolate', ['linear'], ["get", "color"],
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
        9,
        "#78716c",
    ]
    const routeStopLayerStyle = {
        paint: {
            "circle-radius": 4,
            "circle-stroke-color": colorInterpolate,
            "circle-color": "white",
            "circle-stroke-width": 3
        }
    };
    const routePathLayerStyle = {
        paint: {
            "line-width": 6,
            "line-color": colorInterpolate
        },
        layout: {
            "line-cap": ("round" as never),
            "line-join": ("round" as never),
        }
    };
    const bgRoutePathLayerStyle = {
        paint: {
            "line-width": 4,
            "line-color": "#78716c"
        },
        layout: {
            "line-cap": ("round" as never),
            "line-join": ("round" as never),
        }
    };
    const walkPathLayerStyle = {
        paint: {
            "line-width": 8,
            "line-color": "#78716c",
            "line-dasharray": [0.5, 1.5]
        },
        layout: {
            "line-cap": ("round" as never),
            "line-join": ("round" as never),
        }
    };
    const stopLayerStyle = {
        paint: {
            "circle-radius": 10,
            "circle-stroke-color": colorInterpolate,
            "circle-stroke-width": 8,
            "circle-color": "white"
        }
    };
    const originMarkerStyle = {
        layout: {
            'icon-image': 'map-pin-green',
            'icon-size': 0.1,
            "icon-anchor": ("bottom" as never)
        }
    };
    const destinationMarkerStyle = {
        layout: {
            'icon-image': 'map-pin-red',
            'icon-size': 0.1,
            "icon-anchor": ("bottom" as never)
        }
    };
    const vehicleCircleLayerStyle = {
        paint: {
            "circle-radius": 10,
            "circle-color": colorInterpolate
        }
    };
    const vehicleBaseLayerStyle = {
        layout: {
            'icon-image': 'vehicle-base',
            "icon-allow-overlap": true,
            'icon-size': 0.2,
            "icon-anchor": ("center" as never),
            "icon-rotate": (["get", "rotation"] as ["get", string]),
            "icon-pitch-alignment": ("viewport" as never),
            "icon-rotation-alignment": ("map" as never)
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textSizeInterpolate: ["interpolate", any,any, number,number,number,number,number,number,number,number,number,number] = [
        'interpolate', ['linear'], ["get", "textLength"],
        1,
        15,
        2,
        10,
        3,
        8,
        4,
        6,
        5,
        5,
    ]
    const vehicleTextLayerStyle = {
        layout: {
            "text-field": (["format",["get", "text"]] as ["format", ["get", string]]),
            "text-size": textSizeInterpolate,
            "text-font": ["Gotham Rounded Medium"],
            "text-offset": ([0,0.2] as [number, number]),
            "text-allow-overlap": true,
        },
        paint: {
            "text-color": "white"

        }
    };
    return (
        <Map
            id="map"
            initialViewState={{
                latitude: 60.170833,
                longitude: 24.9375,
                zoom: 10
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={hekinavConfig.mapStyle}
            onLoad={() => onMapLoad()}
            onMouseMove={() => onMapLoad(false)}
        > {popups}

            <Source id="temp-data" type="geojson" data={data || { type: "Feature", geometry: { type: "Point", coordinates: [25, 60] } }}>
                <Layer source="temp-data" type="circle" filter={["==", ["get", "type"], "stop"]} id="temp-stop" {...stopLayerStyle}></Layer>
                <Layer beforeId="temp-stop" source="temp-data" type="circle" filter={["==", ["get", "type"], "route-stop"]} id="temp-route-stop" {...routeStopLayerStyle}></Layer>



                <Layer beforeId="temp-route-stop" source="temp-data" type="line" filter={["==", ["get", "type"], "route-path"]} id="temp-route-path" {...routePathLayerStyle}></Layer>

                <Layer beforeId="temp-route-path" source="temp-data" type="line" filter={["==", ["get", "type"], "walk-path"]} id="temp-walk-path" {...walkPathLayerStyle}></Layer>

                <Layer beforeId="temp-route-path" source="temp-data" type="line" filter={["==", ["get", "type"], "bg-route-path"]} id="temp-bg-route-path" {...bgRoutePathLayerStyle}></Layer>

                <Layer source="temp-data" type="symbol" filter={["==", ["get", "type"], "destination-marker"]} id="temp-destination" {...destinationMarkerStyle}></Layer>
                <Layer source="temp-data" type="symbol" filter={["==", ["get", "type"], "origin-marker"]} id="temp-origin" {...originMarkerStyle}></Layer>
            </Source>
            <Source id="mqtt-data" type="geojson" data={{ type: "FeatureCollection", features: [] }}>
                <Layer beforeId="temp-stop" source="mqtt-data" type="symbol" filter={["==", ["get", "type"], "vehicle"]} id="mqtt-vehicle-text" {...vehicleTextLayerStyle}></Layer>
                <Layer beforeId="mqtt-vehicle-text" source="mqtt-data" type="circle" filter={["==", ["get", "type"], "vehicle"]} id="mqtt-vehicle-circle" {...vehicleCircleLayerStyle}></Layer>
                <Layer beforeId="mqtt-vehicle-circle" source="mqtt-data" type="symbol" filter={["==", ["get", "type"], "vehicle"]} id="mqtt-vehicle-base" {...vehicleBaseLayerStyle}></Layer>
            </Source>
        </Map>
    )
}