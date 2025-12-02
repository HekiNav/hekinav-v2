"use client"
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import IconItem from "./iconitem";
import { ChangeEvent, ReactNode, useState } from "react"

export interface Suggestion {
    icon: IconProp,
    text: string,
    id: string
}

export interface InputFieldProps {
    icon: IconProp,
    suggestionFunction?: (text: string) => Array<Suggestion>,
    onlySuggestions?: boolean
}
export default function InputField({ icon, suggestionFunction, onlySuggestions = true }: InputFieldProps) {
    const [focus, setFocus] = useState(false)
    const [value, setValue] = useState("")
    const [suggestions, setSuggestions] = useState(new Array<Suggestion>())
    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value)
        if (suggestionFunction && value.length) setSuggestions(suggestionFunction(e.target.value))
        else setSuggestions([])
    }
    function suggestionSelected(item: Suggestion) {
        setValue(item.text)
        setSuggestions([])
    }
    return (
        <div className={`border-2 p-2 w-full ${focus && "border-blue-500"}`}>
            <IconItem icon={icon}>
                <input
                    value={value}
                    onChange={onChange}
                    onFocus={(e) => { setFocus(true); e.preventDefault() }}
                    onBlur={(e) => {
                        setFocus(false)
                        if (onlySuggestions) {
                            setValue("")
                            onChange(e)
                        }
                        e.preventDefault()
                    }}
                    type="text" className="outline-0 grow w-1" placeholder="Origin" />
            </IconItem>
            <hr hidden={suggestions.length == 0} className={`border-1 m-1 w-full ${focus && "border-blue-500"}`} />
            <div>
                {suggestions.map((s: Suggestion, i) => {
                    return (
                        <div key={`search-suggestion-${i}`} onClick={() => suggestionSelected(s)}>
                            <IconItem icon={s.icon} >
                                {s.text}
                            </IconItem>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}