import RoutingContent from "./content"

export default function Routing() {
    return (
        <>
            <RoutingContent mapStyle={process.env.MAP_STYLE || "/style.json"}></RoutingContent>
        </>
    )
}