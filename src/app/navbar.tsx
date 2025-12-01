"use client"
import { usePathname } from "next/navigation"
import { NavBarItem } from "./components/navbaritem"

export interface PagePath {
    n: string,
    p: string
}
export interface NavBarProps {
    paths: Array<PagePath>
}


export default function NavBar({paths}:NavBarProps) {
    if (!paths) throw new Error("No 'PATHS' parameter found in .env")

    const currPath = usePathname()

    return (
        <div className="flex">
            <div className="shadow-md/30 w-full p-2 flex gap-2 font-sans">
                {paths.map(({ p, n }, i) => {
                    const current = currPath == p
                    return <NavBarItem key={`nav-elem-${i}`} path={p} title={n} current={current}>

                    </NavBarItem>
                })}
            </div>
        </div>

    )
}