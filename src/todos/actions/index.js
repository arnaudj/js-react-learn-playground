import * as actionTypes from './actionTypes';

let nextTodoId = 0

export const addTodo = text => ({
  type: actionTypes.ADD_TODO,
  id: nextTodoId++,
  text
})

// save todo to remote server (simulate roundtrip time)
export const saveAddTodo = text => (
  (dispatch, getState) => {
    setTimeout(() => {
      dispatch(addTodo(text))
    }, 1500);
  })

export const setVisibilityFilter = filter => ({
  type: actionTypes.SET_VISIBILITY_FILTER,
  filter
})

export const toggleTodo = id => ({
  type: actionTypes.TOGGLE_TODO,
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}