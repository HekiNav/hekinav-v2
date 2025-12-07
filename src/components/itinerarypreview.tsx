import { Itinerary, Leg, LegTime } from "@/app/routing/itinerary/[from]/[to]/api/route";
import DepTime from "./deptime";
import { DepartureRow } from "@/app/routing/[stopType]/[id]/departures/page";
import Icon from "./icon";
import { faWalking } from "@fortawesome/free-solid-svg-icons";
import RouteComposition from "./routecomposition";

export interface ItineraryPreviewProps {
    itinerary: Itinerary
}

export default function ItineraryPreview({ itinerary }: ItineraryPreviewProps) {
    const
        { end, start, duration, legs, walkDistance } = itinerary
    const firstTransitLeg = legs.find(l => l.transitLeg)

    return (
        <div className="border-2 border-stone-600 w-full p-2 flex flex-col">
            <div className="flex flex-row justify-between">
                <div>{formatTime(start)} - {formatTime(end)}</div><div>{formatDuration(duration)}</div>
            </div>
            <RouteComposition legs={legs}></RouteComposition>
            <div className="flex flex-row justify-between align-center">
                <div className="flex flex-row" style={{marginTop: "calc(var(--spacing) * 0.5)"}}>
                    <div hidden={!firstTransitLeg} className="text-sm text-stone-500 flex flex-nowrap">Leaves&nbsp;<DepTime short preposition dep={legTimeToDepRow((firstTransitLeg as Leg).start)} /></div>
                    <div hidden={!!firstTransitLeg} className="text-sm text-stone-500">Leave whenever</div>
                </div>

                <div className="flex flex-row flex-nowrap align-center"><Icon className="mr-1" small icon={faWalking}></Icon>{Math.round(walkDistance)}m</div>
            </div>

        </div>
    )
}
export function legTimeToDepRow(time: LegTime): DepartureRow {
    return {
        arrivalDelay: parseISO8601DurationBadly(time.estimated?.delay || ""),
        headsign: "",
        pickupType: "",
        realtime: !!time.estimated,
        realtimeArrival: Math.floor(new Date(time.estimated?.time || 0).getTime() / 1000),
        scheduledArrival: Math.floor(new Date(time.scheduledTime || 0).getTime() / 1000),
        realtimeDeparture: Math.floor(new Date(time.estimated?.time || 0).getTime() / 1000),
        scheduledDeparture: Math.floor(new Date(time.scheduledTime || 0).getTime() / 1000),
        serviceDay: 0,
        realtimeState: "",
        trip: {
            routeShortName: "",
            route: {
                gtfsId: "",
                type: 0
            }
        }
    }
}

export function formatTime(time: string) {
    const date = new Date(time)
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
}
export function formatDuration(duration: number) {
    let str = ""
    if (duration > 3600) str += `${Math.floor(duration / 3600)}h `
    return str + `${Math.floor(duration % 3600 / 60)}min`
}

function parseISO8601DurationBadly(iso8601Duration: string) {
    const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

    const matches = iso8601Duration.match(iso8601DurationRegex)!
    if (!matches) return 0
    const
        sign = matches[1] === undefined ? 1 : -1,
        years = matches[2] === undefined ? 0 : Number(matches[2]),
        months = matches[3] === undefined ? 0 : Number(matches[3]),
        weeks = matches[4] === undefined ? 0 : Number(matches[4]),
        days = matches[5] === undefined ? 0 : Number(matches[5]),
        hours = matches[6] === undefined ? 0 : Number(matches[6]),
        minutes = matches[7] === undefined ? 0 : Number(matches[7]),
        seconds = matches[8] === undefined ? 0 : Number(matches[8])

    const time = sign * ((days * 24 * 3600) + (hours * 3600) + (minutes * 60) + seconds)
    return time;
};