const defaultTodos = [
    { id: 0, text: "Some item completed", completed: true },
    { id: 1, text: "Some item uncompleted", completed: false },
]

const reducer = (state = defaultTodos, action) => {
    return state;
}

export default reducer;