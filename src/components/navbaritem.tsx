import Link from "next/link"

export interface NavBarItemProps {
    path: string,
    title: string,
    current: boolean
}
export function NavBarItem(props: NavBarItemProps) {
    return (
        <Link href={props.path} className={`border-2 ${props.current ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-black"} hover:bg-blue-300 hover:border-blue-300 transition ease-in-out duration-100`}>
            <div className="p-2">{props.title}</div>
        </Link>
    )
}