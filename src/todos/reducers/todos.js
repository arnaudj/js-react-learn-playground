import * as actionTypes from '../actions/actionTypes';

const defaultTodos = [
    { id: 99900, text: "Some item completed", completed: true },
    { id: 99901, text: "Some item uncompleted", completed: false },
]

const handleAddTodo = (state, action) => {
    return [...state, {
        id: action.id,
        text: action.text,
        completed: false
    }];
}

const handleToggleTodo = (state, action) => {
    return state.map(todo => (
        todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo
    ));
}

const reducer = (state = defaultTodos, action) => {
    switch (action.type) {
        case actionTypes.ADD_TODO: return handleAddTodo(state, action);
        case actionTypes.TOGGLE_TODO: return handleToggleTodo(state, action);
        default: return state;
    }
}

export default reducer;