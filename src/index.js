import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-image-crop/dist/ReactCrop.css";

import { persistor, store } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
const rootElement = document.getElementById("root");
rootElement.hasChildNodes()
  ? ReactDOM.render(
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>,
      rootElement
    )
  : ReactDOM.hydrate(
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>,
      rootElement
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
