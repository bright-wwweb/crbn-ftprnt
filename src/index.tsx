import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import './utils/styles/global-styles.css';
import * as serviceWorker from './services/serviceWorker';

const ws = new WebSocket("ws://0.0.0.0:4000/ws")

ws.onopen = () => {
    // connected
    console.log('WS OPENED')
}

ReactDOM.render(
    <App 
        width={2000}
        height={1000}
        ws={ws}
    />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
