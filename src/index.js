import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Select root app:
//import App from './App1'; // General (examples, and thinking in react)
import App from './todos/components/AppTodos'; // General (examples, and thinking in react)

ReactDOM.render(<App />, document.getElementById('root'));
