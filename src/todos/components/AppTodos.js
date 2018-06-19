import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import rootReducer from '../reducers'

const composeEnhancers = composeWithDevTools({
  name: 'MyApp', actionsBlacklist: ['REDUX_STORAGE_SAVE']
});
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

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