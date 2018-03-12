const redux = require('redux');
const createStore = redux.createStore;


let initialState = {
    count: 0
};

let rootReducer = (state = initialState, action) => {
    if (action.type == 'INC') {
        let prevCount = state.count;
        return {
            ...state,
            count: prevCount + 1
        }
    } else if (action.type == 'DEC') {
        let prevCount = state.count;
        return {
            ...state,
            count: prevCount - action.amount
        }
    }
    else {
        return state;
    }
}

let store = createStore(rootReducer);

store.subscribe(() =>
    console.log(store.getState())
)

store.dispatch({ type: 'INC' });
store.dispatch({ type: 'INC' });
store.dispatch({ type: 'INC' });
store.dispatch({ type: 'INC' });
store.dispatch({ type: 'DEC', amount: 2 });

const assert = require('assert');
assert(store.getState().count == 2);
