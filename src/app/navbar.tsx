"use client"
import { usePathname } from "next/navigation"
import { NavBarItem } from "../components/navbaritem"

export interface PagePath {
    n: string,
    p: string,
    e?: boolean
}
export interface NavBarProps {
    paths: Array<PagePath>
}


export default function NavBar({paths}:NavBarProps) {
    if (!paths) throw new Error("No 'PATHS' parameter found in .env")

    const currPath = usePathname()

    return (
        <div className="flex h-15">
            <div className="shadow-md/30 w-full p-2 flex gap-2 font-narrow">
                {paths.map(({ p, n, e }, i) => {
                    const current = currPath == p
                    return <NavBarItem key={`nav-elem-${i}`} path={p} title={n} external={e} current={current}>

                    </NavBarItem>
                })}
            </div>
        </div>

    )
}