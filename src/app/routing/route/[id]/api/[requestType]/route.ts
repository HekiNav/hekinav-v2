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
    [key: string]: TypedDocumentNode
} = {
    departures: gql`
    query Departures($id: String!) {
        route(id: $id) {
            agency {
                name
            }
            patterns {
                patternGeometry {
                    length
                    points
                }
            }
            shortName
            longName
            type
            stops {
                gtfsId
                name
                code
                platformCode
                lat
                lon
            }
        }
    }
  `
}
type RouteRequestType = keyof typeof querys

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string, requestType: string }> }) {

    const { id, requestType } = await params

    const result = await getRouteData(id, requestType)

    return Response.json(result)
}
export async function getRouteData(id: string, requestType: RouteRequestType) {

    console.log(id, requestType)
    const query = querys[requestType]

    return await client.query({
        query: query,
        variables: {
            id: id
        }
    })
}