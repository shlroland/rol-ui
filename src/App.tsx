import React, { FC } from 'react'
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem'
import SubMenu from './components/Menu/subMenu'

const App: FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <Menu
                    defaultIndex="0"
                    mode="vertical"
                    defaultOpenSubMenus={['3']}
                    onSelect={(index) => {
                        alert(index)
                    }}
                >
                    <MenuItem>cool link1</MenuItem>
                    <MenuItem disabled={true}>cool link2</MenuItem>
                    <MenuItem>cool link3</MenuItem>
                    <SubMenu title="dropdown">
                        <MenuItem>dropdown1</MenuItem>
                        <MenuItem>dropdown2</MenuItem>
                        <MenuItem>dropdown3</MenuItem>
                    </SubMenu>
                </Menu>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default App
