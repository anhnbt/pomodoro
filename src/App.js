import React, { Component } from "react";
import Pomodoro from "./Pomodoro";
import Footer from "./Footer";
import Header from "./Header";
import { SnackbarProvider } from "./SnackbarContext"; // Import SnackbarProvider

class App extends Component {
  render() {
    return (
      <div className="App">
        <SnackbarProvider>
          <Header />
          <Pomodoro />
          <Footer />
        </SnackbarProvider>
      </div>
    );
  }
}

export default App;
