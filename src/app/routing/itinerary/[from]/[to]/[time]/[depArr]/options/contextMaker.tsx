"use client"
import { createContext, PropsWithChildren } from "react"
import { ItineraryContext } from "./layout"
import { IEndStartPoint, PlannedConnection } from "../api/route"

export const itineraryContext = createContext<ItineraryContext|null>(null)

export interface ItineraryContextProviderProps extends PropsWithChildren {
    value: ItineraryContext,
    loadMore: (from: IEndStartPoint, to: IEndStartPoint, depArr: string, time: number, type: 1 | 2, cursor: string)=> Promise<PlannedConnection | null>
}

export default function ItineraryContextProvider({children, value, loadMore}: ItineraryContextProviderProps) {
    return (
        <itineraryContext.Provider value={{...value, loadMore: loadMore}}>
          {children}
        </itineraryContext.Provider>
      )
}