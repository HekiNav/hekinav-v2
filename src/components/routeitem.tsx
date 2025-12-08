import { PropsWithChildren, ReactNode } from "react";

export interface RouteItemProps extends PropsWithChildren {
    color1?: string,
    color2?: string,
    borderColor: string,
    icon?: ReactNode
}
export default function RouteItem({ color1 = "", color2 = "", icon, borderColor, children }: RouteItemProps) {
    return (
        <div className="flex flex-row relative align-center w-full">
            <div className="flex flex-row relative">
                <span className="translate-x-3 z-1000 h-full w-4 flex justify-center flex-col">
                    <span hidden={!!icon} className={`${borderColor} block bg-white rounded-full border-4 w-4 h-4`}></span>
                    <span hidden={!icon}>{icon}</span>
                </span>
                <div className={`flex flex-col h-full grow w-0 pr-2 z-1`}>
                    <div className={`${color1 || "border-transparent"} h-full w-0 border-4`}></div>
                    <div className={`${color2 || "border-transparent"} h-full w-0 border-4`}></div>
                </div>
            </div>

            <div className="mb-2 ml-2 mt-1 w-full">
                {children}
            </div>
        </div>
    )
}