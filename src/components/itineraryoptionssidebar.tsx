"use client"
import { IEndStartPoint, PlannedConnection } from "@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/api/route"
import RoutingSearch from "./routingsearch"
import ItineraryPreview from "./itinerarypreview"
import ItineraryCollectionOnMap from "@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/options/mapHandler"
import { useEffect, useState } from "react"

export interface ItinerarySidebarProps {
  data: PlannedConnection | null,
  from: IEndStartPoint,
  to: IEndStartPoint,
  time: number,
  depArr: string,
  after: () => void
  before: () => void
}

export default function ItinerarySidebar({ data, from, to, time, depArr, after, before }: ItinerarySidebarProps) {
  const [selected, setSelected] = useState<number | null>(null)
  if (!data) return (
    <div>
      uh oh
    </div>
  )
  return (
    <div className="p-4 min-w-80 w-4/10 overflow-y-scroll">
      <ItineraryCollectionOnMap origin={from} destination={to} selected={selected} itineraries={data.edges.map(e => e.node)}></ItineraryCollectionOnMap>
      <RoutingSearch origin={from} destination={to} time={time} depArr={depArr == "dep" ? 0 : 1}></RoutingSearch>
      <h1 className="text-xl mb-1 mt-3">Routes</h1>
      <div className="flex flex-col gap-2">
        <button onClick={before} className="w-full border-2 p-2">Departing earlier</button>
        {...data.edges.map((e, i) => (
          <ItineraryPreview key={i} onSelect={() => setSelected(i)} link={`./options/i${i}`} itinerary={e.node}></ItineraryPreview>
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
