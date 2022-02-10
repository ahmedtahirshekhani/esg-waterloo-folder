import "./App.css";
import React, { Component } from "react";
import AppRouter from "./config/router";
import "../src/css/esg.css";

class App extends Component {
  render() {
    return (
      <div>
        <AppRouter />
      </div>
    );
  }
}

export default App;
