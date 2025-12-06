import { PropsWithChildren } from "react";

export interface RouteItemProps extends PropsWithChildren {
    color1?: string,
    color2?: string,
    borderColor: string
}
export default function RouteItem({ color1 = "", color2 = "", borderColor, children }: RouteItemProps) {
    return (
        <div className="flex flex-row relative align-center w-full">
            <span className="translate-x-3 z-1000 h-full w-4 flex justify-center flex-col">
                <span className={`${borderColor} block bg-white rounded-full border-4 w-4 h-4`}></span>
            </span>
            <div className={`flex flex-col h-full w-2 mr-3 z-1`}>
                <div className={`${color1} h-full w-2`}></div>
                <div className={`${color2} h-full w-2`}></div>
            </div>
            <div className="mb-2 mt-1 w-full">
                {children}
            </div>
        </div>
    )
}