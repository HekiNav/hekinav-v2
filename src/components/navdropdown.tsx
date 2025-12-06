"use client"

import { useRouter } from "next/navigation"
import Dropdown, { DropdownProps } from "./dropdown"

export interface NavDropdownProps extends DropdownProps {
    preItemValue: string
    postItemValue: string
}

export default function NavDropdown({ defaultValue, options, preItemValue, postItemValue }: NavDropdownProps) {
    const nav = useRouter()
    return (
        <Dropdown options={options} defaultValue={defaultValue} onSet={(item) => {
            console.log(item)
            nav.push(`${preItemValue}${item.value}${postItemValue}`)
        }}></Dropdown>
    )
}