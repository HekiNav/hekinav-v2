"use client"
import { DepartureRow } from "@/app/routing/[stopType]/[id]/departures/page";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export interface DepTimeProps {
    dep: DepartureRow,
    short?: boolean
    preposition?: boolean
}

const delayColors = {
    early: "text-teal-500",
    mild: "text-amber-500",
    severe: "text-red-600",
}



export default function DepTime({ dep, short = false, preposition = false }: DepTimeProps) {

    if (!dep) return (<></>)
    return (
        <span className="flex flex-row gap-3">
            <span hidden={short || Math.round(dep.arrivalDelay / 60) == 0}>
                <span className={getDelayTime(dep.arrivalDelay)}>{dep.arrivalDelay > 0 && "+"}{Math.round(dep.arrivalDelay / 60)} min</span>
            </span>
            <span hidden={dep.realtime}>
                ~{formatDepTime(dep.scheduledDeparture, dep.serviceDay, preposition)}
            </span>
            <span hidden={!dep.realtime} className="text-lime-500">
                {formatDepTime(dep.realtimeDeparture, dep.serviceDay, preposition)}
            </span>
        </span>
    )
}
function getDelayTime(delaySeconds: number) {
    if (delaySeconds < 0) {
        return delayColors.early
    } else if (delaySeconds > 60 * 5){
        return delayColors.severe
    } else {
        return delayColors.mild
    }
}

export function formatDepTime(relativeTime: number, serviceDate: number, includePrepositions: boolean) {
    // TODO: add timezone handling
    const time = (serviceDate + relativeTime) * 1000
    const diff = time - Date.now();
    if (Math.abs(diff) < 10 * 60 * 1000) {
        return (includePrepositions ? "in " : "") + Math.floor(diff / (60 * 1000)) + " min"
    }
    return (includePrepositions ? "at " : "") + formatInTimeZone(time, "Europe/Helsinki", "HH:mm")
}