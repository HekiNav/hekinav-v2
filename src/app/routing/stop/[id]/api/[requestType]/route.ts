import { type NextRequest } from 'next/server'
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";

const { DIGITRANSIT_SUBSCRIPTION_KEY = "" } = process.env

const client = new ApolloClient({
    link: new HttpLink({
        uri: "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1/", headers: {
            "digitransit-subscription-key": DIGITRANSIT_SUBSCRIPTION_KEY
        }
    }),
    cache: new InMemoryCache(),
});


const querys = {
    departures: gql`
    query Departures($id: String!) {
        stop(id: $id) {
            name
            desc
            code
            platformCode
            lat
            lon
            stoptimesWithoutPatterns(numberOfDepartures: 10,omitCanceled: false, omitNonPickups: false){
            
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
                    route {
                        type
                    }
                    routeShortName  
                }
            }
        }
    }
  `
}
type StopRequestType = keyof typeof querys

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string, requestType: StopRequestType }> }) {

    const { id, requestType } = await params

    const result = await getStopData(id, requestType)

    return Response.json(result)
}
export async function getStopData(id: string, requestType: StopRequestType) {
const query = querys[requestType]

    return await client.query({
        query: query,
        variables: {
            id: id
        }
    })
}