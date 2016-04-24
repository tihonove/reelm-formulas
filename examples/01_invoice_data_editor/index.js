import React from 'react'
import ReactDom from 'react-dom'
import {Provider} from 'react-redux'
import {compose, createStore, applyMiddleware} from 'redux'
import reelmRunner from 'reelm'

import applicationReducer from './src/Application/Application.reducer'
import Application from './src/Application/Application.view'

var store = createStore(applicationReducer, compose(
    reelmRunner(),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));

ReactDom.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('content'));