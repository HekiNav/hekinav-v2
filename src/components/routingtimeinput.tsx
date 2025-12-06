"use client"

import Dropdown, { DropdownItem } from "./dropdown"

export interface RoutingTimeInputProps {
    initialTime?: Date
}
export default function RoutingTimeInput({ initialTime = new Date() }: RoutingTimeInputProps) {
    const times = new Array<DropdownItem>();
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 4; j++) {
            times.push({label:`${i}:${j === 0 ? `00` : 15 * j}`, value: i * 3600 + j * 15 * 60});
        }
    }
    console.log(times)
    return (
        <div className="bg-blue-100 w-full my-2 p-2">
            <Dropdown inline options={[{ value: 0, label: "Departing" }, { value: 1, label: "Arriving" }]}></Dropdown>
            <span className="mr-1">at</span>
            <Dropdown inline options={times}></Dropdown>
        </div>
    )
}