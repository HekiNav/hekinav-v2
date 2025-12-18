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
    patterns: gql`
    query Departures($id: String!) {
        route(id: $id) {
            agency {
                name
            }
            patterns {
                code
                directionId
                patternGeometry {
                    length
                    points
                }
                stops {
                    gtfsId
                    name
                    code
                    platformCode
                    lat
                    lon
                }
            }
            shortName
            longName
            type
        }
    }
  `, departures: gql`
    query Departures($id: String!, $pattern: String!, $now: Long) {
        route(id: $id) {
            patterns {
                code
                stops {
                    gtfsId
                    stopTimesForPattern(id: $pattern, numberOfDepartures: 2, startTime: $now) {
                        arrivalDelay
                
                        realtimeArrival
                        scheduledArrival
                        realtimeDeparture
                        scheduledDeparture

                        realtimeState
                        realtime
                        serviceDay
                        headsign
                        pickupType
                        dropoffType
                    }
                }
            }
        }
    }
  `
}
type RouteRequestType = keyof typeof querys

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string, extraParams: string[] }> }) {

    const { id, extraParams } = await params

    const [requestType, extraParam] = extraParams

    const result = await getRouteData(id, requestType, extraParam)

    return Response.json(result)
}
export async function getRouteData(id: string, requestType: RouteRequestType, extraParam?: string) {

    const query = querys[requestType]


    return await client.query({
        query: query,
        variables: requestType == "departures" ? {
            id: id,
            pattern: `${id}:${extraParam || "0"}:01`,
            now: Math.floor(timeNow() / 1000)
        }: {
            id: id
        }
    })
}
function timeNow() {
    return new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Helsinki"})).getTime()
}