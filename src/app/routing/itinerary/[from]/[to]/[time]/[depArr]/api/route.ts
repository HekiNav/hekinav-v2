import { type NextRequest } from 'next/server'
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { TypedDocumentNode } from '@apollo/client';

const { DIGITRANSIT_SUBSCRIPTION_KEY = "" } = process.env

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1/", headers: {
      "digitransit-subscription-key": DIGITRANSIT_SUBSCRIPTION_KEY
    }
  }),
  cache: new InMemoryCache(),
});


export const querys: {
  [key: string]: TypedDocumentNode
} = {
  first: gql`
query Itineraries(
  $from: PlanLabeledLocationInput!
  $to: PlanLabeledLocationInput!
  $time: PlanDateTimeInput
) {
  planConnection(origin: $from, destination: $to, first: 10, dateTime: $time) {
    pageInfo {
      startCursor
      endCursor
    }
    edges {
      node {
        duration
        start
        end
        walkDistance
        waitingTime
        walkTime
        legs {
          distance
          transitLeg
          from {
            name
            stop {
              name
              platformCode,
              code,
              gtfsId,
              desc,
              lat,
              lon
            }
          }
          to {
            name
            stop {
              name
              platformCode,
              code,
              gtfsId,
              desc,
              lat, 
              lon
            }
          }
          start {
            scheduledTime
            estimated {
              delay
              time
            }
          }
          end {
            scheduledTime
            estimated {
              delay
              time
            }
          }
          mode
          
          legGeometry {
            points
            length
          }
          duration
          realtimeState
          route {
            type
            shortName
            gtfsId
            longName
          }
          trip {
            directionId
            departureStoptime {
              scheduledDeparture
              serviceDay
            }
          }
          headsign
        }
      }
    }
  }
}
    `
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ from: string, to: string, depArr: string, time: string }> }) {

  const { from, to, depArr, time } = await params

  const
    fromJ = JSON.parse(from),
    toJ = JSON.parse(to),

    result = await getItineraryData(fromJ, toJ, depArr, Number(time))

  return Response.json(result)
}
export async function getItineraryData(from: IEndStartPoint, to: IEndStartPoint, depArr: string, time: number): Promise<{ data: { planConnection: PlannedConnection }, error: never }> {


  const query = querys.first

  const timeString = new Date(time).toISOString();

  return (await client.query({
    query: query,
    variables: {
      from: from,
      to: to,
      time: depArr == "dep" ? { earliestDeparture: timeString } : { latestArrival: timeString }
    }
  }) as { data: { planConnection: PlannedConnection }, error: never })
}

export interface IEndStartPoint {
  location: { coordinate: IPos, }
  label: string
}
export interface IPos {
  latitude: number,
  longitude: number
}
export interface PlannedConnection {
  pageInfo: {
    startCursor: string,
    endCursor: string
  },
  edges: { node: Itinerary }[]
}
export interface Itinerary {
  start: string,
  end: string,
  duration: number,
  walkDistance: number,
  walkTime: number,
  waitingTime: number,
  legs: Leg[]
}
export interface Leg {
  from: IPlace,
  to: IPlace
  start: LegTime,
  end: LegTime,
  mode: string,
  transitLeg: boolean,
  legGeometry: {
    points: string,
    length: number
  }
  duration: number,
  distance: number,
  realtimeState: string,
  route?: LegRoute,
  headsign?: string,
  trip: {
    directionId: string,
    departureStoptime: {
      scheduledDeparture: number,
      serviceDay: number
    }
  }
}
export interface LegRoute {
  type: number,
  shortName: string,
  gtfsId: string,
  longName: string
}
export interface LegTime {
  scheduledTime: string
  estimated?: {
    delay: string
    time: string
  }
}
export interface IPlace {
  name: string
  stop?: IStop
}
export interface IStop {
  name: string
  platformCode?: string
  code?: string,
  gtfsId: string,
  desc: string,
  lat: number,
  lon: number
}