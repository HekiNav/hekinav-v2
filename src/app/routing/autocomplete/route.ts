import { type NextRequest } from 'next/server'


export async function GET(request: NextRequest) {
    const { DIGITRANSIT_SUBSCRIPTION_KEY } = process.env

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    if (query == null) return Response.json({error: "Url parameter 'query' missing or invalid"})
    if (!query || query.length < 3) return Response.json({data:{}})
    const response = await fetch(`http://api.digitransit.fi/geocoding/v1/autocomplete?digitransit-subscription-key=${DIGITRANSIT_SUBSCRIPTION_KEY}&text=${encodeURIComponent(query)}`)
    const data: GeoJSON.FeatureCollection = await response.json()

    return Response.json({data: data})
}