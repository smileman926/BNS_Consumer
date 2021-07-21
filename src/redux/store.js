import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import reducers from "./rootReducers";
import rootSaga from "./sagas";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, thunk];
const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"],
};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };
