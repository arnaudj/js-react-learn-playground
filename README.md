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