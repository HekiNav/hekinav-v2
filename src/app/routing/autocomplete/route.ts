import { type NextRequest } from 'next/server'


export async function GET(request: NextRequest) {
    const { DIGITRANSIT_SUBSCRIPTION_KEY } = process.env

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    if (query == null) return Response.json({error: "Url parameter 'query' missing or invalid"})
    if (!query || query.length < 3) return Response.json({data:{}})
    const response = await fetch(`http://api.digitransit.fi/geocoding/v1/autocomplete?digitransit-subscription-key=${DIGITRANSIT_SUBSCRIPTION_KEY}&boundary.polygon=25.5345 60.2592,25.3881 60.1693,25.3559 60.103,25.3293 59.9371,24.2831 59.78402,24.2721 59.95501,24.2899 60.00895,24.3087 60.01947,24.1994 60.12753,24.1362 60.1114,24.1305 60.12847,24.099 60.1405,24.0179 60.1512,24.0049 60.1901,24.0445 60.1918,24.0373 60.2036,24.0796 60.2298,24.1652 60.2428,24.3095 60.2965,24.3455 60.2488,24.428 60.3002,24.5015 60.2872,24.4888 60.3306,24.5625 60.3142,24.5957 60.3242,24.6264 60.3597,24.666 60.3638,24.7436 60.3441,24.9291 60.4523,24.974 60.5253,24.9355 60.5131,24.8971 60.562,25.0388 60.5806,25.1508 60.5167,25.2242 60.5016,25.3661 60.4118,25.3652 60.3756&text=${encodeURIComponent(query)}`)
    const data: GeoJSON.FeatureCollection = await response.json()

    return Response.json({data: data})
}