"use server"

import Label from "@/components/label"
import { getRouteData } from "../api/[requestType]/route"
import DepTime from "@/components/deptime"
import Link from "next/link"
import RouteItem from "@/components/routeitem"
import { redirect } from "next/navigation"
import Dropdown, { DropdownItem } from "@/components/dropdown"
import NavDropdown from "@/components/navdropdown"

export default async function RouteDeparturesView({
  params,
}: {
  params: Promise<{ id: string, directionId: string }>
}) {
  const { id, directionId } = await params

  const direction = Number(directionId[1])

  console.log(direction)

  if (Number.isNaN(direction)) {
    redirect(`/routing/route/${id}/d0`)
  }

  const { data, error } = await getRouteData(decodeURIComponent(id), "departures")



  if (error || !data) return (
    <div className="p-4 min-w-80 w-4/10">
      <h1 className="text-xl text-red-500">500 Internal server error</h1>
      <div className="text-lg">
        Failed to get route data
      </div>
    </div>
  )



  const { type, longName, shortName, patterns } = (data.route as Route);


  const color = colors[type]
  const borderColor = borderColors[type]

  const stops = patterns[direction].stops

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

  console.log(patterns)

  return (
    <div className="p-4 min-w-80 w-4/10 flex flex-col gap-2 ">
      <div className="text-lg flex flex-row gap-2 items-center">
        <div><Label className={`text-white ${color}`} hidden={!shortName}>{shortName}</Label></div>
        <span hidden={!longName} className="text-2xl">{longName}</span>
      </div>
      <div>
        <NavDropdown defaultValue={direction} options={options} preItemValue={`/routing/route/${id}/d`} postItemValue=""/>
      </div>
      <div className="grow border-2 border-stone-600 flex flex-col p-2 overflow-scroll">
        {...stops.map((stop, i) => {
          return (
            <Link href={`/routing/stop/${stop.gtfsId}/departures`} key={i} className="flex flex-row justify-between gap-5">
              <RouteItem color1={i == 0 ? undefined : color} color2={i == stops.length - 1 ? undefined : color} borderColor={borderColor}>
                {stop.name}
              </RouteItem>
              {/* <div className="text-nowrap">
                <DepTime dep={stop}></DepTime>
              </div> */}
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
  directionId: number,
  patternGeometry: {
    length: number,
    points: string
  }
  stops: RouteStop[]
}