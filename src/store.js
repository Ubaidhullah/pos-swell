import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";

const persistedState = sessionStorage.getItem("appstate")
  ? JSON.parse(sessionStorage.getItem("appstate"))
  : {};

const configureStore = () => {
  const middlewares = [thunk];

  if (process.env.REACT_APP_NODE_ENV !== "production") {
    middlewares.push(createLogger());
  }

  return createStore(rootReducer, persistedState, applyMiddleware(...middlewares));
};

const store = configureStore();

store.subscribe(() => {
  sessionStorage.setItem("appstate", JSON.stringify(store.getState()));
});

export default store;
