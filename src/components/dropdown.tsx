"use client"

import { useState } from "react";
import Icon from "./icon";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export interface DropdownProps {
    options: DropdownItem[],
    onSet?: (item: DropdownItem) => void,
    defaultValue?: number
    inline?: boolean
}
export interface DropdownItem {
    label: string,
    value: number
}

export default function Dropdown({ options, defaultValue, onSet, inline = false}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options.find(o => o.value == defaultValue)?.label || options[0].label);

    const toggleDropdown = (state?: boolean) => {
        setIsOpen(state || !isOpen);
    };

    const handleSelect = (item: DropdownItem) => {
        toggleDropdown(false)

        if (onSet) onSet(item)

        setSelected(item.label)
    };

    return (
        <div className={`relative inline-block text-left ${!inline && "w-full"}`}>
            {/* Dropdown button */}
            <button
                type="button"
                className={`inline-flex justify-between w-full ${!inline && "bg-white px-4 py-2 border-2"} ${inline && "mr-1"}  text-sm font-medium text-black focus:border-blue-500`}
                onFocus={() => toggleDropdown(true)}
                onBlur={() => toggleDropdown(false)}
            >
                {selected}
                <Icon className={`${isOpen ? "text-blue-500" : ""} `} icon={faCaretDown}></Icon>
            </button>

            {isOpen && (
                <div className={`origin-top-right absolute
                                    ${!inline && "bg-white border-2 border-blue-500"} right-0 left-0 z-1001
                                     border-t-0`}>
                    <div className="py-1">
                        {options.filter(o => o.label != selected).map((item, index) => (
                            <a
                                key={index}
                                href="#"
                                className="block px-4 py-2
                                               text-sm text-black
                                               hover:bg-gray-100"
                                onMouseDown={() => handleSelect(item)}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}