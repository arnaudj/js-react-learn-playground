import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ComponentStatefulWithArrowFunctionHandler from './examples/components/ComponentStatefulWithArrowFunctionHandler';
import ThinkingInReact from './thinkinginreact/components/ThinkingInReact';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ComponentStatefulWithArrowFunctionHandler message="hello, live" /><hr />
        <ThinkingInReact /><hr />
      </div>
    );
  }
}

export default App;
