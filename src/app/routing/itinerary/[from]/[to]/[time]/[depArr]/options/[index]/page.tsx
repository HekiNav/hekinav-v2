"use client"

import { useContext } from "react"
import ItinerarySidebar from "@/components/itinerarysidebar"
import { itineraryContext } from "../contextMaker"
import { redirect, useParams, useRouter } from "next/navigation"
import DotNavigationThingy from "@/components/dotnavigationthingy"
import MqttVehiclesOnMap from "@/components/mqtthandler"
import {formatInTimeZone} from "date-fns-tz"

export default function RouteDeparturesView() {
  const c = useContext(itineraryContext)
  const { index }: { index: string } = useParams()
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
  const itinerary = data.edges[i].node

  const [colorTable, topics] = itinerary.legs.reduce((prev, curr) => {
    if (curr.transitLeg && curr.trip && curr.route) {
      const depTime = curr.trip.departureStoptime
      const timeString = formatInTimeZone((depTime.serviceDay + depTime.scheduledDeparture) * 1000,"Europe/Helsinki", "HH:mm")
      const idWithoutPrefix = curr.route.gtfsId.split(":")[1]
      return [{ ...prev[0], [idWithoutPrefix]: getColor(curr.route.type) }, [...prev[1],
    `/hfp/v2/journey/ongoing/+/+/+/+/${idWithoutPrefix}/${Number(curr.trip.directionId)+1}/+/${timeString}/#`]]
    }
    return prev
  }, [{}, new Array<string>()])

  return (
    <div>
      <MqttVehiclesOnMap colorTable={colorTable} topics={topics}></MqttVehiclesOnMap>
      <DotNavigationThingy amount={data.edges.length} selected={i} onSet={(i) => nav.replace(`./i${i}`)}></DotNavigationThingy>
      <ItinerarySidebar data={itinerary} from={from} to={to} time={time} depArr={depArr}></ItinerarySidebar>
    </div>
  )
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