import { IconProps } from "./icon"
import Icon from "./icon"

export interface IconItemProps extends React.PropsWithChildren {
    icon: IconProps
}
export default function IconItem({children, icon}: IconItemProps) {
    return (
        <div className="flex flex-row gap-2 items-center">
            <Icon {...icon}></Icon>
            {children}
        </div>
    )
}