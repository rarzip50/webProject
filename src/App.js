import React from "react";
import logo from "./logo.svg";
import "./App.css";
import HomePage from "./components/homePage/HomePage";
import Login from "./components/login/Login";
import MenuBar from "./components/menuBar/MenuBar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/tt" component={MenuBar} />
        </Switch>
      </BrowserRouter>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
