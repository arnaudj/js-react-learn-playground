import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import AsyncApp from "./containers/AsyncApp";

const store = configureStore();

class AppReddit extends Component {
  render() {
    return (
      <Provider store={store}>
        <AsyncApp />
      </Provider>
    );
  }
}

export default AppReddit;
