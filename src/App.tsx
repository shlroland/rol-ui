import React, { FC, useState } from 'react'
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem'
import SubMenu from './components/Menu/subMenu'
import Icon from './components/Icon/icon'
import Transition from './components/Transition/transition'
import Button from './components/Button/button'

const App: FC = () => {
    const [show, setShow] = useState(false)
    return (
        <div className="App">
            <header className="App-header">
                <Icon icon="coffee" theme="danger" size="10x"></Icon>
                <Menu
                    defaultIndex="0"
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
                <Button
                    size="lg"
                    onClick={() => {
                        setShow(!show)
                    }}
                >
                    {' '}
                    Toggle{' '}
                </Button>
                <Transition in={show} timeout={300} animation="zoom-in-left">
                    <div>
                        <p>
                            Edit <code>src/App.tsx</code> and save to reload.
                        </p>
                        <p>
                            Edit <code>src/App.tsx</code> and save to reload.
                        </p>
                        <p>
                            Edit <code>src/App.tsx</code> and save to reload.
                        </p>
                        <p>
                            Edit <code>src/App.tsx</code> and save to reload.
                        </p>
                        <p>
                            Edit <code>src/App.tsx</code> and save to reload.
                        </p>
                    </div>
                </Transition>
                <Transition in={show} timeout={300} animation="zoom-in-left" wrapper>
                    <Button btnType="primary" size="lg">
                        A Large Button
                    </Button>
                </Transition>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default App
