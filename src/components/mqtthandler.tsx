"use client"
import { GeoJSONSource } from "maplibre-gl"
import mqtt from "mqtt"
import { useEffect } from "react"
import { useMap } from "react-map-gl/maplibre"

export interface MqttVehiclesProps {
    topics: string[],
    colorTable: { [key: string]: number }
}
export default function MqttVehiclesOnMap({ topics, colorTable }: MqttVehiclesProps) {
    const { map } = useMap()

    useEffect(() => {



        const vehicles = new Map<string, Vehicle>()

        const client = mqtt.connect("wss://mqtt.hsl.fi:443/")

        client.on("connect", () => {
            console.log("connected")
            topics.forEach(topic => {
                client.subscribe(topic)
            });
        })
        client.on("message", onMessage)
        function onMessage(topic: string, message: Buffer<ArrayBufferLike>) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [type, data]: [HFPMessageType, HFPMessage] = Object.entries(JSON.parse(message.toString()) as { [key in HFPMessageType]: HFPMessage })[0] as [HFPMessageType, HFPMessage]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [root, prefix, version, journey_type, temporal_type, event_type, transport_mode, operator_id, vehicle_number, route_id, direction_id, headsign, start_time, next_stop, geohash_level, geohash] = topic.split("/")

            const color = colorTable[data.route || ""]

            console.log(colorTable, data.route, colorTable[data.route || ""])

            if (data && data.lat && data.long) {
                const id = `${operator_id}/${vehicle_number}`
                vehicles.set(id, {
                    position: [data.long, data.lat],
                    route: data.desi || "?",
                    color: Number.isNaN(color) ? 8 : color,
                    rotation: data.hdg || 0
                })
            }
            scheduleUpdate()
        }
        let pending = false;

        function scheduleUpdate() {
            if (!pending) {
                pending = true;
                requestAnimationFrame(() => {
                    pending = false;
                    updateMapSource();
                });
            }
        }
        function updateMapSource() {
            if (!map || !map.getSource("mqtt-data")) return

            const features: GeoJSON.Feature[] = Array.from(vehicles.values().map((v: Vehicle) => {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: v.position
                    },
                    properties: {
                        type: "vehicle",
                        color: v.color,
                        textLength: v.route.length,
                        text: v.route,
                        rotation: v.rotation
                    }
                }
            }));

            ; (map.getSource("mqtt-data") as GeoJSONSource).setData({
                type: "FeatureCollection",
                features: features
            })
        }
        return () => {
            client.end();
            if (map && map.getSource("mqtt-data")) (map.getSource("mqtt-data") as GeoJSONSource).setData({
                type: "FeatureCollection",
                features: []
            })
        }
    })

    return (
        <></>
    )
}
export interface HFPMessage {
    desi?: string
    dir?: string
    oper: number
    veh: number
    tst: string
    tsi: number
    spd: number
    hdg: number
    lat?: number
    long?: number
    acc: number
    dl?: number
    odo: number
    drst: HFPDoorStatus
    oday: string
    jrn: number
    line: number
    start: string
    loc: HFPLocationSource
    stop?: string
    route?: string
    occu?: number
    seq?: number
    label?: string
    ttarr?: string
    ttdep?: string
    "dr-type"?: HFPDriverType
    "tlp-requestid"?: number
    "tlp-requesttype"?: string
    "tlp-prioritylevel"?: string
    "tlp-reason"?: string
    "tlp-att-seq"?: number
    "tlp-decision"?: string
    sid?: number
    "signal-groupid"?: number
    "tlp-signalgroupnbr"?: number
    "tlp-line-configid"?: number
    "tlp-point-configid"?: number
    "tlp-frequency"?: number
    "tlp-protocol"?: string
}
export interface Vehicle {
    position: [number, number],
    route: string,
    color: number,
    rotation: number
}
export enum HFPLocationSource {
    GPS = "GPS",
    ODO = "ODO",
    MAN = "MAN",
    DR = "DR",
    "N/A" = "N/A",
}
export enum HFPDoorStatus {
    CLOSED,
    OPEN
}
export enum HFPDriverType {
    TECHNICIAN,
    DRIVER
}
export enum HFPMessageType {
    vp = "vp", // Vehicle position
    due = "due", // Vehicle will soon arrive to a stop
    arr = "arr", // Vehicle arrives inside of a stop radius
    dep = "dep", // Vehicle departs from a stop and leaves the stop radius
    ars = "ars", // Vehicle has arrived to a stop
    pde = "pde", // Vehicle is ready to depart from a stop
    pas = "pas", // Vehicle passes through a stop without stopping
    wait = "wait", // Vehicle is waiting at a stop
    doo = "doo", // Doors of the vehicle are opened
    doc = "doc", // Doors of the vehicle are closed
    tlr = "tlr", // Vehicle is requesting traffic light priority
    tla = "tla", // Vehicle receives a response to traffic light priority request
    da = "da", // Driver signs in to the vehicle
    dout = "dout", // Driver signs out of the vehicle
    ba = "ba", // Driver selects the block that the vehicle will run
    bout = "bout", // Driver signs out from the selected block (usually from a depot)
    vja = "vja", // Vehicle signs in to a service journey (i.e. a single public transport journey from location A to location B, also known as trip)
    vjout = "vjout", // Vehicle signs off from a service journey, after reaching the final stop
}