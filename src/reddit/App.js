import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(
    (state, action) => state,
    {});

class AppReddit extends Component {
    render() {
        return (
            <Provider store={store}>
                <div>Reddit!
                </div>
            </Provider>
        );
    }
}

export default AppReddit;