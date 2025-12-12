"use client"

import Dropdown, { DropdownItem } from "./dropdown"

export interface RoutingTimeInputProps {
    initialTime?: number,
    initialDepArr?: number,
    onTimeSet: (value: number) => void
    onDepArrSet: (value: number) => void
}
export default function RoutingTimeInput({ initialDepArr = 0, initialTime, onDepArrSet, onTimeSet }: RoutingTimeInputProps) {
    const times = new Array<DropdownItem>();
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 4; j++) {
            times.push({ label: `${i}:${j === 0 ? `00` : 15 * j}`, value: (i-2) * 3600 + j * 15 * 60 });
        }
    }
    if (!initialTime) {
        // eslint-disable-next-line react-hooks/purity
        initialTime = Date.now()
        onTimeSet(initialTime)
    }
    const dayStartUTC = (Math.floor(initialTime / 86400000) * 86400000)

    const timeOffset = dayStartUTC

    const dayTime = Math.round((initialTime) % (24 * 3600 * 1000) / (15 * 60 * 1000)) * 15 * 60 * 1000

    return (
        <div className="bg-blue-100 w-full my-2 p-2">
            <Dropdown onSet={({ value }) => onDepArrSet(value)} inline defaultValue={initialDepArr} options={[{ value: 0, label: "Departing" }, { value: 1, label: "Arriving" }]}></Dropdown>
            <span className="mr-1">at</span>
            <Dropdown onSet={({ value }) => onTimeSet(value * 1000 + timeOffset)} inline options={times} defaultValue={dayTime / 1000}></Dropdown>
        </div>
    )
}