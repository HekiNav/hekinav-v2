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
          }
          end {
            scheduledTime
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
        toJ = JSON.parse(to)
    console.log(fromJ, toJ)
    const result = await getItineraryData(fromJ, toJ)

    return Response.json(result)
}
export async function getItineraryData(from: IEndStartPoint, to: IEndStartPoint) {


    const query = querys.first

    console.log(query)


    return await client.query({
        query: query,
        variables: {
            from: from,
            to: to
        }
    })
}

export interface IEndStartPoint {
    location: { coordinate: IPos, }
    label: string
}
export interface IPos {
    latitude: number,
    longitude: number
}