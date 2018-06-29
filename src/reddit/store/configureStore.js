import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers";

const loggerMiddleware = createLogger();

const composeEnhancers = composeWithDevTools({
  name: "MyApp",
  actionsBlacklist: ["REDUX_STORAGE_SAVE"]
});

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware))
  );
}
