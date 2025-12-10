"use client"
import { IEndStartPoint, Itinerary, LegTime } from "@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/api/route"
import { formatDuration, formatTime } from "./itinerarypreview"
import { faClockFour, faLocationDot, faWalking } from "@fortawesome/free-solid-svg-icons"
import IconItem from "./iconitem"
import RouteItem from "./routeitem"
import Icon from "./icon"
import Label from "./label"
import Link from "next/link"
import { formatDepTime } from "./deptime"
import LegOnMap from "@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/options/mapHandler"
import ItineraryOnMap from "@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/options/mapHandler"

export interface ItinerarySidebarProps {
  data: Itinerary,
  from: IEndStartPoint,
  to: IEndStartPoint,
  time: number,
  depArr: string
}

export default function ItinerarySidebar({ data, from, to, time, depArr }: ItinerarySidebarProps) {
  console.log(data)
  function formatLegTime(time: LegTime) {
    if (time.estimated) {
      return <span className="text-lime-500">{formatTime(time.estimated.time)}</span>
    }
    return <span>~{formatTime(time.scheduledTime)}</span>
  }

  return (
    <div className="p-4 min-w-80 w-4/10 overflow-y-scroll h-screen pb-40">
      <ItineraryOnMap itinerary={data}></ItineraryOnMap>
      <h1 className="text-2xl">Itinerary</h1>
      <div className="flex flex-row gap-10 text-stone-900 text-sm">
        <IconItem icon={{ icon: faClockFour }}>
          <div className="flex flex-col">
            <div>{formatTime(data.start)} - {formatTime(data.end)}</div>
            <div>{formatDuration(data.duration)}</div>
          </div>
        </IconItem>
        <div>
          <IconItem icon={{ icon: faWalking }}>
            <div className="flex flex-col">
              <div>{Math.round(data.walkDistance)}m</div>
              <div>{formatDuration(data.walkTime)}</div>
            </div>
          </IconItem>
        </div>
      </div>
      <hr className="border-stone-700 border-1 my-2" />
      <div className="flex flex-col">
        {...data.legs.map((l, i) => {

          const nl = data.legs[i + 1] || l;


          const type = (l.transitLeg ? l.route?.type : 1000) as keyof typeof colors;
          const nextType = (nl.transitLeg ? nl.route?.type : 1000) as keyof typeof colors;


          const borderColor = borderColors[type]
          const color = colors[type]

          const nextBorderColor = borderColors[nextType]
          const nextColor = colors[nextType]

          const stop = l.to.stop

          const isSameStopTransfer = l.transitLeg && nl.transitLeg

          const stopContents = (
            <div className=" flex flex-row w-full my-1">
              {stop ? (
                <div className="flex flex-row justify-between w-full">
                  <Link href={`/routing/stop/${stop.gtfsId}/departures`}>
                    <div className="text-lg flex flex-row gap-2 items-center -mb-2">
                      <span className="text-lg truncate">{stop.name}</span>
                      <div><Label className="text-sm bg-stone-300" hidden={!stop.platformCode}>pl. {stop.platformCode}</Label></div>
                    </div>
                    <div className="text-md flex flex-row gap-2 items-center">
                      <div><Label hidden={!stop.code} className="bg-stone-300 text-sm">{stop.code} </Label></div>
                      <div hidden={!stop.desc} className=" text-stone-600">{stop.desc}</div>
                    </div>
                  </Link>
                  <div className="flex h-full flex-col align-center">
                    <span>{formatLegTime(l.transitLeg ? l.end : nl.start)}</span>
                    <span className="-mt-2" hidden={!isSameStopTransfer}>{formatLegTime(nl.start)}</span>
                  </div>
                </div>
              ) : (
                <div>
                  {l.to.name}
                </div>
              )}
            </div>
          )
          const routeContents = (
            <div className=" flex flex-row w-full my-0">
              <Link href={`/routing/route/${nl.route?.gtfsId}/${nl.trip?.directionId}/`} className="text-lg flex flex-row gap-2 items-center">
                <div><Label className={`text-white ${nextColor}`}>{nl.route?.shortName || nl.route?.longName}</Label></div>
                <span className="text-lg">{nl.headsign}</span>
              </Link>
            </div>
          )
          const walkContents = (
            <div className=" flex flex-row w-full my-0">
              Walk for {Math.ceil((i == 0 ? l : nl).distance)}m ({formatDuration((i == 0 ? l : nl).duration)})
            </div>
          )
          return (
            <>
              <div key={i + data.legs.length} hidden={i != 0}>
                <RouteItem borderColor={borderColor} icon={<Icon className="text-green-500" icon={faLocationDot}></Icon>} color2={borderColor}>
                  <div className="flex flex-ro w-full justify-between"><div>{from.label}</div><div>{formatLegTime(l.start)}</div></div>
                </RouteItem>
              </div>

              <div key={i + 2 * data.legs.length} hidden={i != 0}>
                <RouteItem borderColor={borderColor} icon={<div></div>} color1={borderColor} color2={borderColor}>{l.transitLeg ? routeContents : walkContents}</RouteItem>
              </div>

              <div key={i + 3 * data.legs.length} hidden={i == data.legs.length - 1}>
                <RouteItem borderColor={l.transitLeg ? borderColor : nextBorderColor} color1={borderColor} color2={nextBorderColor}>{stopContents}</RouteItem>
              </div>
              <div key={i + 4 * data.legs.length} hidden={i == data.legs.length - 1}>
                <RouteItem borderColor={l.transitLeg ? borderColor : nextBorderColor} icon={<div></div>} color1={nextBorderColor} color2={nextBorderColor}>{nl.transitLeg ? routeContents : walkContents}</RouteItem>
              </div>

              <div key={i + 5 * data.legs.length} hidden={i != data.legs.length - 1}>
                <RouteItem borderColor={borderColor} color1={borderColor} icon={<Icon className="text-pink-500" icon={faLocationDot}></Icon>}>
                  <div className="flex flex-ro w-full justify-between"><div>{to.label}</div><div>{formatLegTime(l.end)}</div></div>
                </RouteItem>
              </div>
            </>
          )
        })
        }
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
  1000: string
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
  1000: "bg-stone-600"
}
const borderColors: typeof colors = {
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
  1000: "border-stone-600 border-dotted"
}
