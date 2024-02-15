import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppRouter from "./router/AppRouter";
import { grey, blueGrey } from "@mui/material/colors";
import { Provider } from "react-redux";
import store, { persistor } from "./app/store";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: grey["900"],
      },
      secondary: {
        main: blueGrey["900"],
      },
    },
  });

  useEffect(() => {
    // Check if the initial value is already set in localStorage
    const category = localStorage.getItem('category');

    // If not set, initialize it and set it in localStorage
    if (!category) {
      const p_uid = uuidv4();
      const s_uid = uuidv4();
      let categoryParsed = JSON.stringify([
        {_id : String(p_uid), name: 'Product'},
        {_id : String(s_uid), name: 'Services'},
      ]);
      localStorage.setItem('category', categoryParsed);
    } 
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
          </PersistGate>
        </Provider>
        <ToastContainer />
      </ThemeProvider>
    </>
  );
}

export default App;
