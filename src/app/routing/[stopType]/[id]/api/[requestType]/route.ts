import { type NextRequest } from 'next/server'
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { StopType } from '@/app/routing/layout';
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
    [key: string]: {
        stop: TypedDocumentNode
        station: TypedDocumentNode
    }
} = {
    departures:  {
        stop: gql`
    query Departures($id: String!) {
        stop(id: $id) {
            name
            desc
            code
            platformCode
            lat
            lon
            gtfsId
            routes {
                type
                gtfsId
            }
            stoptimesWithoutPatterns(numberOfDepartures: 50,omitCanceled: false, omitNonPickups: false){
            
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

                trip {
                    directionId
                    route {
                        gtfsId
                        type
                    }
                    routeShortName  
                }
            }
        }
    }
  `, station: gql`
    query Departures($id: String!) {
        station(id: $id) {
            name
            desc
            code
            platformCode
            lat
            lon
            routes {
                type
                gtfsId
            }
            stoptimesWithoutPatterns(numberOfDepartures: 50,omitCanceled: false, omitNonPickups: false){
            
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

                trip {
                    directionId
                    route {
                        type
                        gtfsId
                    }
                    routeShortName  
                }
            }
        }
    }
  `}
}
type StopRequestType = keyof typeof querys

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string, requestType: string, stopType: string }> }) {

    const { id, requestType, stopType } = await params

    const result = await getStopData(id, requestType, stopType as StopType)

    return Response.json(result)
}
export async function getStopData(id: string, requestType: StopRequestType, stopType: StopType) {
    const query = querys[requestType][stopType]

    return await client.query({
        query: query,
        variables: {
            id: id
        }
    })
}