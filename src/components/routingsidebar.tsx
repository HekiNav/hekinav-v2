"use client"

import RoutingSearch from "./routingsearch"

export default function RoutingSideBar() {

    return (
        <div className="p-4 min-w-80 w-4/10">
            <h1 className='font-bold font-rounded text-xl mb-2'>Where to?</h1>
            <RoutingSearch></RoutingSearch>
        </div>
    )
}