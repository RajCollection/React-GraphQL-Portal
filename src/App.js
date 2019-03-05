import React, { Component} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import Error from "./components/error";
class App extends Component {

  render() {
 
    return (
  <BrowserRouter>
    <Switch>
    <Route path="/" component={Login} exact/>
    <Route path="/home" component={Home} />
    <Route component={Error} />
    </Switch>
  </BrowserRouter>

    );
  }
}

export default App;
