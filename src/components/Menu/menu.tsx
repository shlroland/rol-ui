import React, { createContext, useState } from 'react'
import classNames from 'classnames'
import { MenuItemProps } from './menuItem'

type MenuMode = 'horizontal' | 'vertical'
type selectCallBack = (selectedIndex: string) => void

export interface MenuProps {
    defaultIndex?: string
    className?: string
    mode?: MenuMode
    style?: React.CSSProperties
    onSelect?: selectCallBack
    defaultOpenSubMenus?: string[]
}
interface RMenuContext {
    index?: string
    onSelect?: selectCallBack
    mode?: MenuMode
    defaultOpenSubMenus?: string[]
}

export const MenuContext = createContext<RMenuContext>({ index: '0' })

const Menu: React.FC<MenuProps> = (props) => {
    const { className, mode, style, children, defaultIndex, onSelect, defaultOpenSubMenus } = props
    const [currentActive, setActive] = useState(defaultIndex)

    const handleClick = (index: string) => {
        setActive(index)
        if (onSelect) onSelect(index)
    }

    const passedContent: RMenuContext = {
        index: currentActive ? currentActive : '0',
        onSelect: handleClick,
        mode,
        defaultOpenSubMenus,
    }

    const classes = classNames('rol-menu', className, {
        'menu-vertical': mode === 'vertical',
        'menu-horizontal': mode === 'horizontal',
    })

    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            const childElement = child as React.FunctionComponentElement<MenuItemProps>
            const { displayName } = childElement.type
            if (displayName === 'MenuItem' || displayName === 'SubMenu') {
                return React.cloneElement(childElement, {
                    index: index.toString(),
                })
            } else {
                console.error('Warning: Menu has a child which is not a MenuItem component')
            }
        })
    }

    return (
        <ul className={classes} style={style} data-testid="test-menu">
            <MenuContext.Provider value={passedContent}>{renderChildren()}</MenuContext.Provider>
        </ul>
    )
}

Menu.defaultProps = {
    defaultIndex: '0',
    mode: 'horizontal',
}

export default Menu
