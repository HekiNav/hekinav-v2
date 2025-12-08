"use client"

import { useContext } from "react"
import ItinerarySidebar from "@/components/itinerarysidebar"
import { itineraryContext } from "../contextMaker"
import { redirect, useParams, useRouter } from "next/navigation"

export default function RouteDeparturesView() {
  const c = useContext(itineraryContext)
  const {index}: {index: string} = useParams()
  const nav = useRouter()

  if (!index) {
    redirect("./")
  }

  if (!c) return (
    <div>
      err
    </div>
  )
  const { from, to, depArr, time, data } = c

  const i = Number(index.substring(1, index.length))

  if (Number.isNaN(i)) {
    redirect("./")
  }

  return (
    <div>
      <ItinerarySidebar data={data.edges[i].node} from={from} to={to} time={time} depArr={depArr}></ItinerarySidebar>
    </div>
  )
}