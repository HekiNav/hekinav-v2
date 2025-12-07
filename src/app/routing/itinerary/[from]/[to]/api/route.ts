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
query Itineraries($from: PlanLabeledLocationInput!, $to: PlanLabeledLocationInput!)
    {
  planConnection(
    origin: $from
    destination: $to
    first: 10
  ) {
    pageInfo {
      startCursor
      endCursor
    }
    edges {
      node {
        duration
        walkDistance
        start
        end
        legs {
          from {
            name
          }
          to {
            name
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
          route {
            type
            shortName
          }
          mode
          transitLeg
          legGeometry {
            points
            length
          }
          duration
          realtimeState
        }
      }
    }
  }
}
    `
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ from: string, to: string }> }) {

  const { from, to } = await params

  const
    fromJ = JSON.parse(from),
    toJ = JSON.parse(to),

    result = await getItineraryData(fromJ, toJ)

  return Response.json(result)
}
export async function getItineraryData(from: IEndStartPoint, to: IEndStartPoint): Promise<{ data: { planConnection: PlannedConnection }, error: never }> {


  const query = querys.first


  return (await client.query({
    query: query,
    variables: {
      from: from,
      to: to
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
  realtimeState: string
  route: LegRoute
}
export interface LegRoute {
  type: number,
  shortName: string
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
}