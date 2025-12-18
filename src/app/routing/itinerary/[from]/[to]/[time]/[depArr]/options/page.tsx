"use client"

import { useContext, useEffect, useState } from "react"
import ItinerarySidebar from "@/components/itineraryoptionssidebar"
import { itineraryContext } from "./contextMaker"
import { BA, IEndStartPoint, Itinerary, PlannedConnection } from "../api/route"

export default function ItineraryOptionsView() {
  const c = useContext(itineraryContext)

  const [dataState, setData] = useState<PlannedConnection | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(data)
  })

  if (!c) return (
    <div>
      err
    </div>
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { from, to, depArr, time, data, loadMore = async (_from: IEndStartPoint, _to: IEndStartPoint, _depArr: string, _time: number, _type: 1 | 2, _cursor: string) => null } = c

  



  async function more(ba: 1 | 2) {
    const newConnection = await loadMore(from, to, depArr, time, ba, ba == BA.BEFORE ? data.pageInfo.startCursor : data.pageInfo.endCursor)
    if (!newConnection) return
    console.log(dataState, newConnection)
    setData({
      ...newConnection
    })
  }

  return (
    <ItinerarySidebar before={() => more(1)} after={() => more(2)} from={from} to={to} time={Number(time)} depArr={depArr} data={dataState}></ItinerarySidebar>
  )
}