import React from 'react';
import ReactDOM from 'react-dom';

import "./styles/style.css";

import {SocketProvider} from "./context/SocketCtx";
import {App} from './components/App'; 

ReactDOM.render(
    <SocketProvider>
        <App />
    </SocketProvider>,
    document.getElementById("root")
);
