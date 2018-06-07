import React from 'react';

const Todo = ({ text, completed }) => (
    <p>todo item: {text} (completed: {completed ? 'yes' : 'no'})</p>
);

export default Todo;