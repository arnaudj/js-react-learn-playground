import * as actionTypes from '../actions/actionTypes';

const defaultTodos = [
    { id: 0, text: "Some item completed", completed: true },
    { id: 1, text: "Some item uncompleted", completed: false },
]

const handleToggleTodo = (state, action) => {
    return state.map(todo => (
        todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo
    ));
}

const reducer = (state = defaultTodos, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_TODO: return handleToggleTodo(state, action);
        default: return state;
    }
}

export default reducer;