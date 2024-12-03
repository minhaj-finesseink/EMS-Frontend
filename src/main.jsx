import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthContext from "./context/authContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthContext>
      <App />
    </AuthContext>
  </Provider>
);
