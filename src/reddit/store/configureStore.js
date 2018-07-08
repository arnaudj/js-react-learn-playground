import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers";
import rootSaga from "../sagas";

export default function configureStore(preloadedState) {
  const composeEnhancers = composeWithDevTools({
    name: "MyApp",
    actionsBlacklist: ["REDUX_STORAGE_SAVE"]
  });
  const loggerMiddleware = createLogger();
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware, loggerMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
