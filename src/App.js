import React, { Component } from "react";
import Pomodoro from "./Pomodoro";
import Footer from "./Footer";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Pomodoro />
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
