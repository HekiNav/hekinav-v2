"use client"

import { useContext } from "react"
import ItinerarySidebar from "@/components/itineraryoptionssidebar"
import { itineraryContext } from "./contextMaker"

export default function ItineraryOptionsView() {
  const c = useContext(itineraryContext)
  if (!c) return (
    <div>
      err
    </div>
  )
  const { from, to, depArr, time, data } = c

  return (
    <ItinerarySidebar from={from} to={to} time={Number(time)} depArr={depArr} data={data}></ItinerarySidebar>
  )
}