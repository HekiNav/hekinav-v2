import { Leg } from "@/app/routing/itinerary/[from]/[to]/api/route";
import Icon from "./icon";
import { faWalking } from "@fortawesome/free-solid-svg-icons";

export default function RouteComposition({legs}: {legs: Leg[]}) {
    const totalDuration = legs.reduce((prev, curr) => prev + curr.duration,0)
    console.log(totalDuration)
    return (
        <div className="w-full flex flex-row">
            {...legs.map((l, i) => {
                const color = l.transitLeg ? colors[l.route.type] : "bg-stone-600"
                const percent = (l.duration / totalDuration)
                const text = getText(l)
                return (
                    <div style={{width: `${percent * 100}%`}} className={`px-1 text-white flex flex-row align-center ${color}`} key={i}>{text}</div>
                )
            })}
        </div>
    )
}
function getText(leg: Leg) {
    if (leg.transitLeg) return <>{leg.route.shortName}</>
    if (leg.mode == "WALK") return <Icon small icon={faWalking}></Icon>
    return <></>
}
const colors: {[key: number]:string} = {
  701: "bg-blue-500",
  700: "bg-blue-500",
  702: "bg-orange-500",
  1: "bg-orange-500",
  109: "bg-purple-600",
  4: "bg-cyan-600",
  705: "bg-blue-800",
  704: "bg-blue-500",
  0: "bg-green-600",
  900: "bg-teal-600",
}