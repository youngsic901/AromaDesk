import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Home from "./login/Home";
import LoginCus from "./login/loginCus";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginCus />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
