"use client"
import { createContext, PropsWithChildren } from "react"
import { ItineraryContext } from "./layout"

export const itineraryContext = createContext<ItineraryContext|null>(null)

export interface ItineraryContextProviderProps extends PropsWithChildren {
    value: ItineraryContext
}

export default function ItineraryContextProvider({children, value}: ItineraryContextProviderProps) {
    return (
        <itineraryContext.Provider value={value}>
          {children}
        </itineraryContext.Provider>
      )
}