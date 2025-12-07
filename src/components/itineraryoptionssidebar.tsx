"use client"
import { IEndStartPoint, PlannedConnection } from "@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/api/route"
import RoutingSearch, { utcTime } from "./routingsearch"
import ItineraryPreview from "./itinerarypreview"

export interface ItinerarySidebarProps {
  data: PlannedConnection,
  from: IEndStartPoint,
  to: IEndStartPoint,
  time: number,
  depArr: string
}

export default function ItinerarySidebar({ data, from, to, time, depArr }: ItinerarySidebarProps) {
  return (
    <div className="p-4 min-w-80 w-4/10 overflow-scroll">
      <RoutingSearch origin={from} destination={to} time={utcTime(time)} depArr={depArr == "dep" ? 0 : 1}></RoutingSearch>
      <h1 className="text-xl mb-1 mt-3">Routes</h1>
      <div className="flex flex-col gap-2">
        {...data.edges.map((e,i) => (
        <ItineraryPreview itinerary={e.node} key={i}></ItineraryPreview>
      ))}
      <div hidden={data.edges.length != 0}>Could not find routes. Check parameters.</div>
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
