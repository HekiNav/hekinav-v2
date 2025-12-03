import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";

export interface IconProps extends FontAwesomeIconProps, PropsWithChildren {
    boxed?: boolean
}

export default function Icon(props: IconProps) {
    return (
        <div className={`${props.className || ""} flex items-center`}>
            <FontAwesomeIcon className=" h-5! w-5!" {...props} widthAuto></FontAwesomeIcon>
        </div>
    )
} 