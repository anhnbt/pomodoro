import React, { Component } from "react";
import Pomodoro from './Pomodoro';
import Footer from "./Footer";
import { Provider } from "react-redux";
import store from "./redux/store"; // Import Redux store
import Header from "./Header";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Header />
        <Pomodoro />
        <Footer />
      </Provider>
    );
  }
}

export default App;
