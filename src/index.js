import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router";

//Redux Toolkit
// import { store, persistor } from "./state/store";
import { store } from "./state/store";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";

//global CSS
import "./styles/global.css";
//bootstrap loader
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
