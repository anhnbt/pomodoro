import React, { Component } from "react";
import Pomodoro from "./Pomodoro";
import Header from "./Header";
import Footer from "./Footer";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Pomodoro />
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
