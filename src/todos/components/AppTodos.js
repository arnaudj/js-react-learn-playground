import React, { Component } from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Footer from './Footer'
import AddTodo from '../../../containers/tutos/todos/AddTodo'
import VisibleTodoList from '../../../containers/tutos/todos/VisibleTodoList'

const rootReducer = (state = {}, action) => {
  return state;
};
const store = createStore(rootReducer);

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