"use server"

import Label from "@/components/label"
import { getStopData } from "../api/[requestType]/route"
import DepTime from "@/components/deptime"
import { StopType } from "@/app/routing/layout"
import Link from "next/link"
import StopOnMap from "./mapHandler"

export default async function StopDeparturesView({
  params,
}: {
  params: Promise<{ id: string, stopType: StopType }>
}) {
  const { id, stopType } = await params

  const { data, error } = await getStopData(decodeURIComponent(id), "departures", stopType)
  if (error || !data) return (
    <div className="p-4 min-w-80 w-4/10">
      <h1 className="text-xl text-red-500">500 Internal server error</h1>
      <div className="text-lg">
        Failed to get departures for stop
      </div>
    </div>
  )

  const stop = (data as { stop: Stop, station: Stop })[stopType],
    { stoptimesWithoutPatterns, name, desc, platformCode, code } = stop

  return (
    <div className="p-4 min-w-80 w-7/10 max-w-160 flex flex-col gap-2 h-full">
      <StopOnMap stop={stop}></StopOnMap>
      <div className="text-lg flex flex-row gap-2 items-center -mb-3">
        <span className="text-2xl">{name}</span>
        <div><Label hidden={!platformCode}>pl. {platformCode}</Label></div>
      </div>
      <div className="text-md flex flex-row gap-2 items-center">
        <div><Label hidden={!code} className="p-1 text-sm">{code} </Label></div>
        <div hidden={!desc} className=" text-stone-600">{desc}</div>
      </div>
      <h1 className="text-xl mt-4">Departures</h1>
      <div className="grow border-2 border-stone-600 flex flex-col p-2  overflow-scroll">
        {...(stoptimesWithoutPatterns as Array<DepartureRow>).map((dep, i) => {
          const color = colors[dep.trip.route.type]
          if (!color) console.log(dep.trip.route.type)
          return (
            <div key={i} className="flex flex-row justify-between gap-5">
              <div className="shrink truncate">
                <Link href={`/routing/route/${dep.trip.route.gtfsId}/departures`}>
                  <Label className={"mr-1 text-white " + color}>{dep.trip.routeShortName}</Label>
                  {dep.headsign}
                </Link>

              </div>
              <div className="text-nowrap">
                <DepTime dep={dep}></DepTime>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
const colors: {
  701: string,
  700: string,
  702: string,
  1: string,
  0: string,
  109: string,
  704: string,
  705: string,
  4: string,
  900: string,
} = {
  701: "bg-blue-500",
  700: "bg-blue-500",
  702: "bg-orange-500",
  1: "bg-orange-500",
  109: "bg-purple-600",
  4: "bg-cyan-600",
  705: "bg-blue-800",
  704: "bg-blue-500",
  0: "bg-green-600",
  900: "bg-teal-600",
}
export interface Stop {
  name: string
  desc: string
  code: string
  platformCode: string
  lat: number
  lon: number
  stoptimesWithoutPatterns: DepartureRow[]
}

export interface DepartureRow {
  arrivalDelay: number

  realtimeArrival: number
  scheduledArrival: number
  realtimeDeparture: number
  scheduledDeparture: number

  realtimeState: string
  realtime: boolean
  serviceDay: number
  headsign: string
  pickupType: string

  trip: {
    routeShortName: string
    route: {
      type: keyof typeof colors
      gtfsId: string
    }
  }
}