"use client"
import { IEndStartPoint, Itinerary } from "@/app/routing/itinerary/[from]/[to]/[time]/[depArr]/api/route"
import { formatDuration, formatTime } from "./itinerarypreview"
import { faClockFour, faWalking } from "@fortawesome/free-solid-svg-icons"
import IconItem from "./iconitem"
import RouteItem from "./routeitem"

export interface ItinerarySidebarProps {
  data: Itinerary,
  from: IEndStartPoint,
  to: IEndStartPoint,
  time: number,
  depArr: string
}

export default function ItinerarySidebar({ data, from, to, time, depArr }: ItinerarySidebarProps) {
  return (
    <div className="p-4 min-w-80 w-4/10 overflow-scroll">
      <h1 className="text-xl">Itinerary</h1>
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
              <div>{formatDuration(data.duration)}</div>
            </div>
          </IconItem>
        </div>
      </div>
      <hr className="border-stone-700 border-1 my-2" />
      <div className="flex flex-col">
        {...data.legs.map((l, i) => {

          const nl = i != data.legs.length ? data.legs[i - 1] : null;

          const type = (l.transitLeg ? l.route.type : 1000) as keyof typeof colors;
          const nextType = (l.transitLeg ? l.route.type : 1000) as keyof typeof colors;


          const borderColor = borderColors[type]
          const color = colors[type]

          const nextBorderColor = borderColors[nextType]
          const next = colors[nextType]

          const itemContents = (
            <div className=" flex flex-row w-full">
              yippee <br />
              yay
            </div>
          )
          return (
            <>
              <div key={i + data.legs.length} hidden={i != 0}>
                <RouteItem borderColor={borderColor} color2={borderColor}>{itemContents}</RouteItem>
              </div>
              <div key={i} hidden={i == data.legs.length - 1}>
                <RouteItem borderColor={borderColor}>{itemContents}</RouteItem>
              </div>
              <div key={i + 2 * data.legs.length} hidden={i != data.legs.length - 1}>
                <RouteItem borderColor={borderColor} color1={borderColor}>{itemContents}</RouteItem>
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
  1000: "border-stone-600"
}
