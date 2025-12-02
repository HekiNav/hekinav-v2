import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { type IconProp } from "@fortawesome/fontawesome-svg-core"

export interface IconItemProps extends React.PropsWithChildren {
    icon: IconProp
}
export default function IconItem({children, icon}: IconItemProps) {
    return (
        <div className="flex flex-row gap-2 items-center">
            <FontAwesomeIcon icon={icon} className="shrink"></FontAwesomeIcon>
            {children}
        </div>
    )
}