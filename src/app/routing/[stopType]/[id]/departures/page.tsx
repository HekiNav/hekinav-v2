"use server"

import Label from "@/components/label"
import { getStopData } from "../api/[requestType]/route"

export enum StopType {
  STOP = "stop",
  STATION = "station"
}

export default async function StopDeparturesView({
  params,
}: {
  params: Promise<{ id: string, stopType: StopType }>
}) {
  const { id, stopType } = await params
  const { data, error } = await getStopData(decodeURIComponent(id), "departures", stopType)
  if (error) return (
    <div className="p-4 min-w-80 w-4/10">
      <h1 className="text-xl text-red-500">500 Internal server error</h1>
      <div className="text-lg">
        Failed to get departures for stop
      </div>
    </div>
  )
  console.log(data)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { stoptimesWithoutPatterns, name, desc, platformCode, code } = (data as any)[stopType]

  return (
    <div className="p-4 min-w-80 w-4/10 flex flex-col gap-2 h-full">
      <div className="text-lg flex flex-row gap-2 items-center">
        <span className="text-2xl">{name}</span>
        <div><Label hidden={!platformCode}>pl. {platformCode}</Label></div>
      </div>
      <div className="text-md flex flex-row gap-2 items-center">
        <div><Label hidden={!code} className="p-1 text-sm">{code} </Label></div>
        <div hidden={!desc} className=" text-stone-600">{desc}</div>
      </div>
      <div className="grow border-2 border-stone-600 flex flex-col gap-0 p-2">
        {...(stoptimesWithoutPatterns as Array<DepartureRow>).map((dep, i) => {
          const color = colors[dep.trip.route.type]
          if (!color) console.log(dep.trip.route.type)
          return (
            <div key={i} className="flex flex-row">
              <div>
                <Label className={"mr-1 text-white " + color}>{dep.trip.routeShortName}</Label>
                {dep.headsign}
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
  702: "bg-orange-500",
  1: "bg-orange-500",
  109: "bg-purple-600",
  4: "bg-cyan-600",
  705: "bg-blue-800",
  704: "bg-blue-500",
  0: "bg-green-600",
  900: "bg-teal-600",
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
    }
  }
}