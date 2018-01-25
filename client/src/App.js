import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';

class App extends Component {
    render() {
        return (
            <div className="App" style={{backgroundColor: 'black', color: 'white'}}>
                <Main />
            </div>
        );
    }
}

export default App;

