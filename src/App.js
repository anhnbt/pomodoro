import React, { Component } from "react";
import Pomodoro from './Pomodoro';
import Footer from "./Footer";
import Header from "./Header";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Pomodoro />
        <Footer />
      </div>
    );
  }
}

export default App;
