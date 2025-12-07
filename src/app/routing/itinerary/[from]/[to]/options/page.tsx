"use server"

import { getItineraryData } from "../api/route"
import ItinerarySidebar from "@/components/itineraryoptionssidebar"

export default async function RouteDeparturesView({
  params,
}: {
  params: Promise<{ from: string, to: string }>
}) {
  const { from, to } = await params

  const
      fromJ = JSON.parse(decodeURIComponent(from)),
      toJ = JSON.parse(decodeURIComponent(to))

  const { data, error } = await getItineraryData(fromJ, toJ)

  if (error || !data) return (
    <div className="p-4 min-w-80 w-4/10">
      <h1 className="text-xl text-red-500">500 Internal server error</h1>
      <div className="text-lg">
        Failed to get route data
      </div>
    </div>
  )
  console.log(data)
  return (
    <ItinerarySidebar from={fromJ} to={toJ} data={data.planConnection}></ItinerarySidebar>
  )
}