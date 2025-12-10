import Link from "next/link"
import Icon from "./icon"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

export interface NavBarItemProps {
    path: string,
    title: string,
    current: boolean,
    external?: boolean
}
export function NavBarItem(props: NavBarItemProps) {
    return (
        <Link href={props.path} className={`border-2 ${props.current ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-black"} hover:bg-blue-300 hover:border-blue-300 transition ease-in-out duration-100`}>
            <div className="p-2 flex flex-nowrap flex-row items-center gap-1">{props.title} <span hidden={!props.external}><Icon small icon={faUpRightFromSquare}></Icon></span> </div>
        </Link>
    )
}