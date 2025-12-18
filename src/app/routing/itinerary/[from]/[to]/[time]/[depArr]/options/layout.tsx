"use server"

import { PropsWithChildren } from "react"
import { getItineraryData, IEndStartPoint, PlannedConnection } from "../api/route"
import ItineraryContextProvider from "./contextMaker"

export interface ItineraryLayoutProps extends PropsWithChildren {
  params: Promise<{ from: string, to: string, depArr: string, time: string }>
}
export interface ItineraryContext {
  from: IEndStartPoint,
  to: IEndStartPoint,
  depArr: string,
  time: number,
  data: PlannedConnection,
  loadMore?: (from: IEndStartPoint, to: IEndStartPoint, depArr: string, time: number, type: 1 | 2, cursor: string) => Promise<PlannedConnection | null>,
}

export default async function ItineraryLayout({
  params,
  children
}: ItineraryLayoutProps) {
  const { from, to, depArr, time } = await params


  const
    fromJ = JSON.parse(decodeURIComponent(from)),
    toJ = JSON.parse(decodeURIComponent(to))

  const { data, error } = await getItineraryData(fromJ, toJ, depArr, Number(time))

  if (error || !data) return (
    <div className="p-4 min-w-80 w-4/10">
      <h1 className="text-xl text-red-500">500 Internal server error</h1>
      <div className="text-lg">
        Failed to get route data
      </div>
    </div>
  )
  return (
    <ItineraryContextProvider value={{
      from: fromJ,
      to: toJ,
      data: data.planConnection,
      depArr: depArr,
      time: Number(time)
    }}
      loadMore={loadMore}>
      {children}
    </ItineraryContextProvider>
  )
}
export async function loadMore(from: IEndStartPoint, to: IEndStartPoint, depArr: string, time: number, type: 1 | 2, cursor: string) {
  const { data, error } = await getItineraryData(from, to, depArr, time, type, cursor)
  if (!data || error) return null
  return data.planConnection
}