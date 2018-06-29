# React notes

- Setting state:
  - Prefer using previous state (state is updated async)
  - New state to be wrapped in (), otherwise JS will eval as function body with label (with no return keyword, thus no returned value)
  ```javascript
          this.setState((prevState) => ({
              ticks: prevState.ticks + 1
          }));
  ```
- Redux:
  - Pitfalls:
    - `connect()`: takes functions as parameter (state to props, dispatch to props)
    - `combineReducers()`: takes 1 object, with each key as a state sub domain
    ```javascript
    combineReducers({
        todos,
        visibilityFilter
    });
    ```
  - [Redux actions](https://github.com/redux-utilities/redux-actions)
    - Create action (no mapper):   `createAction("SELECT_SUBREDDIT")` => `{ type: "SELECT_SUBREDDIT", payload: "frontend" };`
    - Create action (with mapper): ```createAction("RECEIVE_POSTS",
  (subreddit, json) => ({
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  })``` 
  => `{ type: "RECEIVE_POSTS", payload: {subreddit: "frontend", posts: [....],  receivedAt:....}}`
    - Reducer: ```
handleActions(
  {
    [selectSubreddit /* <- action by reference here */]: (state, { payload }) => payload // param 2 is the action object, so destructure to get the payload value
  },
  "reactjs" /* <- default state */
);```


- Prettier:
  - Enable at editor.formatOnSave, cf [vscode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - Remove unicode characters blocking format: replace to empty: `[^\x00-\x7f]`

- ReactJS code snippets:
  - [vscode extension](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets)

# Examples
## React
- A simple stateful component: [code](src/examples/components/ComponentStatefulWithArrowFunctionHandler.js)
- Tutorial [Thinking in React](https://reactjs.org/docs/thinking-in-react.html): [code](src/thinkinginreact/components/ThinkingInReact.js)

## Redux
- Redux Todo list [tutorial](https://github.com/reactjs/redux/blob/master/examples/todos): [code](src/todos)

- Redux Reddit [tutorial](https://redux.js.org/advanced/example-reddit-api): [code](src/reddit)

# Misc
- Doc for [Create React App](create-react-app.md)