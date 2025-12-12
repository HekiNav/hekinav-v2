"use server"

import Label from "@/components/label"
import { getRouteData } from "../api/[...extraParams]/route"
import DepTime from "@/components/deptime"
import Link from "next/link"
import RouteItem from "@/components/routeitem"
import { redirect } from "next/navigation"
import { DropdownItem } from "@/components/dropdown"
import NavDropdown from "@/components/navdropdown"
import RouteOnMap from "./mapHandler"
import MqttVehiclesOnMap from "@/components/mqtthandler"

export default async function RouteDeparturesView({
  params,
}: {
  params: Promise<{ id: string, directionId: string }>
}) {
  const { id, directionId } = await params

  const direction = Number(directionId[1])


  if (Number.isNaN(direction)) {
    redirect(`/routing/route/${id}/d0`)
  }
  const idDecoded = decodeURIComponent(id)

  const { data, error } = await getRouteData(idDecoded, "patterns")

  const depData = await getRouteData(idDecoded, "departures", direction.toString())


  if (error || depData.error || !depData.data || !data) return (
    <div className="p-4 min-w-80 w-4/10">
      <h1 className="text-xl text-red-500">500 Internal server error</h1>
      <div className="text-lg">
        Failed to get route data
      </div>
    </div>
  )



  const route = (data.route as Route),
    { type, longName, shortName, patterns } = route


  const color = colors[type]
  const borderColor = borderColors[type]

  const pattern = patterns.find(p => p.code == `${idDecoded}:${direction}:01`)!


  const stops = pattern.stops


  const options: DropdownItem[] = patterns.map(p => {
    const first = p.stops[0].name
    const last = p.stops[p.stops.length - 1].name

    return { value: p.directionId, label: `${first} => ${last}` }
  }).reduce((unique, o) => {
    if (!unique.some(obj => obj.value === o.value)) {
      unique.push(o);
    }
    return unique;
  }, new Array<DropdownItem>());

  const idWithoutPrefix = idDecoded.split(":")[1]

  const colorId = getColor(type)

  return (
    <div className="p-4 min-w-80 w-7/10 max-w-160 flex flex-col gap-2 h-full pb-10">
      <RouteOnMap route={route} pattern={pattern}></RouteOnMap>
      <MqttVehiclesOnMap colorTable={{[idWithoutPrefix]: colorId}} topics={[`/hfp/v2/journey/ongoing/+/+/+/+/${idWithoutPrefix}/${direction+1}/#`]}></MqttVehiclesOnMap>
      <div className="text-lg flex flex-row gap-2 items-center">
        <div><Label className={`text-white ${color}`} hidden={!shortName}>{shortName}</Label></div>
        <span hidden={!longName} className="text-2xl">{longName}</span>
      </div>
      <h1 className="text-xl mt-4">Stops</h1>
      <div>
        <NavDropdown defaultValue={direction} options={options} preItemValue={`/routing/route/${id}/d`} postItemValue="" />
      </div>
      <div className="grow border-2 border-stone-600 flex flex-col p-2 overflow-y-scroll">
        {...stops.map((stop, i) => {
          const deps = depData.data?.route.patterns.find((p: RoutePattern) => p.code == pattern.code)?.stops.find((s: RouteStop) => s.gtfsId == stop.gtfsId).stopTimesForPattern
          return (
            <Link href={`/routing/stop/${stop.gtfsId}/departures`} key={i} className="flex flex-row justify-between gap-5">
              <RouteItem color1={i == 0 ? undefined : borderColor} color2={i == stops.length - 1 ? undefined : borderColor} borderColor={borderColor}>
                <div className="flex flex-row w-full justify-between">
                  <div>
                    <div className="-mb-2">{stop.name}</div>
                    <Label className="text-xs bg-stone-300 mr-1 min-w-min">{stop.code}</Label>
                    <Label hidden={!stop.platformCode} className="text-xs bg-stone-300">pl. {stop.platformCode}</Label>
                  </div>
                  <div hidden={deps.length < 2} className="flex flex-col items-end">
                    <DepTime short dep={deps[0]}></DepTime>
                    <div className="flex nowrap text-xs">
                      Next&nbsp;<DepTime short dep={deps[1]}></DepTime>
                    </div>

                  </div>
                </div>
              </RouteItem>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
const colors: {
  701: string,
  702: string,
  700: string,
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
const borderColors: {
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
  701: "border-blue-500",
  700: "border-blue-500",
  702: "border-orange-500",
  1: "border-orange-500",
  109: "border-purple-600",
  4: "border-cyan-600",
  705: "border-blue-800",
  704: "border-blue-500",
  0: "border-green-600",
  900: "border-teal-600",
}
function getColor(type: number) {
    if (type == 702) return 1
    else if (type == 701) return 0
    else if (type == 700) return 0
    else if (type == 1) return 1
    else if (type == 109) return 2
    else if (type == 4) return 3
    else if (type == 705) return 4
    else if (type == 704) return 5
    else if (type == 900) return 6
    else if (type == 0) return 7
    else return 8
}

export interface Route {
  agency: {
    name: string
  },
  patterns: RoutePattern[],
  shortName: string
  longName: string
  type: keyof typeof colors
}
export interface RouteStop {
  name: string
  code: string
  platformCode: string
  lat: number
  lon: number
  gtfsId: string
}
export interface RoutePattern {
  code: string,
  directionId: number,
  patternGeometry: {
    length: number,
    points: string
  }
  stops: RouteStop[]
}