"use client"
export interface RoutingTimeInputProps{
    initialTime?: Date
}
export default function RoutingTimeInput({initialTime = new Date()}: RoutingTimeInputProps) {
    return (
        <div className="bg-blue-100 w-full my-2 p-2">
            <select name="departure-or-arrival">
                <option value="departure">Departing</option>
                <option value="arrival">Arriving</option>
            </select>
            at
            [TIME]
        </div>
    )
}