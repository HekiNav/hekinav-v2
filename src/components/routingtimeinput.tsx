"use client"

import Dropdown from "./dropdown"

export interface RoutingTimeInputProps{
    initialTime?: Date
}
export default function RoutingTimeInput({initialTime = new Date()}: RoutingTimeInputProps) {
    return (
        <div className="bg-blue-100 w-full my-2 p-2">
           <Dropdown inline options={[{value: 0, label: "Departing"}, {value: 1, label: "Arriving"}]}></Dropdown>
            at
            [TIME]
        </div>
    )
}