import React, { FC } from 'react'
import Button, { ButtonType, ButtonSize } from './components/Button/button'

const App: FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <Button className="custom">hello</Button>
                <Button btnType={ButtonType.Primary} size={ButtonSize.Large}>
                    Large Primary
                </Button>
                <Button btnType={ButtonType.Danger} size={ButtonSize.Small}>
                    Small Danger
                </Button>
                <Button btnType={ButtonType.Link} size={ButtonSize.Small} target="_top" href="https://baidu.com">
                    baidu link
                </Button>
                <Button btnType={ButtonType.Link} disabled href="https://baidu.com">
                    baidu link
                </Button>
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
