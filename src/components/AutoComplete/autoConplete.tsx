import React, { FC, useState, ChangeEvent, ReactElement, useEffect, KeyboardEvent, useRef } from 'react'
import Input, { InputProps } from '../Input/input'
import Icon from '../Icon/icon'
import Transition from '../Transition/transition'
import useDebounce from '../../hooks/useDebounce'
import useClickOutside from '../../hooks/useClickOutside'
import classNames from 'classnames'

interface DataSourceObject {
    value: string
}

export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>
    onSelect?: (item: DataSourceType) => void
    renderOption?: (item: DataSourceType) => ReactElement
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { fetchSuggestions, onSelect, value, renderOption, ...restProps } = props

    const [inputValue, setInputValue] = useState(value as string)
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [highlightIndex, setHighLightIndex] = useState(-1)
    const triggerSearch = useRef(false)
    const componentRef = useRef<HTMLDivElement>(null)
    const debounceValue = useDebounce(inputValue, 500)

    useClickOutside(componentRef, () => {
        setSuggestions([])
    })
    useEffect(() => {
        if (debounceValue && triggerSearch.current) {
            setSuggestions([])
            const results = fetchSuggestions(debounceValue)
            if (results instanceof Promise) {
                setLoading(true)
                results.then((data) => {
                    setLoading(false)
                    setSuggestions(data)
                    if (data.length > 0) {
                        setShowDropdown(true)
                    }
                })
            } else {
                setSuggestions(results)
                setShowDropdown(true)
                if (results.length > 0) {
                    setShowDropdown(true)
                }
            }
        } else {
            setShowDropdown(false)
        }
        setHighLightIndex(-1)
    }, [debounceValue])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setInputValue(value)
        triggerSearch.current = true
    }

    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setShowDropdown(false)
        setSuggestions([])
        if (onSelect) onSelect(item)
        triggerSearch.current = false
    }

    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }

    const highlight = (index: number) => {
        if (index < 0) index = 0
        if (index >= suggestions.length) {
            index = suggestions.length - 1
        }
        setHighLightIndex(index)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            case 13:
                if (suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex])
                }
                break
            case 38:
                highlight(highlightIndex - 1)
                break
            case 40:
                highlight(highlightIndex + 1)
                break
            case 27:
                setShowDropdown(false)
                break
            default:
                break
        }
    }

    const generateDropdown = () => {
        return (
            <Transition
                in={showDropdown || loading}
                animation="zoom-in-top"
                timeout={300}
                onExited={() => {
                    setSuggestions([])
                }}
            >
                <ul className="rol-suggestion-list">
                    {loading && (
                        <div className="suggestions-loading-icon">
                            <Icon icon="spinner" spin></Icon>
                        </div>
                    )}
                    {suggestions.map((item, index) => {
                        const classes = classNames('suggestion-item', {
                            'is-active': index === highlightIndex,
                        })
                        return (
                            <li key={index} onClick={() => handleSelect(item)} className={classes}>
                                {renderTemplate(item)}
                            </li>
                        )
                    })}
                </ul>
            </Transition>
        )
    }

    return (
        <div className="rol-auto-complete" ref={componentRef}>
            <Input value={inputValue} onChange={handleChange} {...restProps} onKeyDown={handleKeyDown} />
            {generateDropdown()}
        </div>
    )
}

export default AutoComplete
