import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./components/app/App";
import store from "./store";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f50b5",
    },
    background: {
      default: "#f4f6f8",
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById("root")
);

registerServiceWorker();