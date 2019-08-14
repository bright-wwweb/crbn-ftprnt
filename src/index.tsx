import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// stubbed arduino response - TODO: stub this in test
// 0 represents blue (A) nodes
const arduinoResp = "A";

ReactDOM.render(
    <App 
        width={800}
        height={600}
        resp={arduinoResp}
    />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
