import React, { Component } from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import rootReducer from '../reducers'

const store = createStore(rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // chrome redux tools
);

class AppTodos extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <AddTodo />
          <VisibleTodoList />
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default AppTodos;