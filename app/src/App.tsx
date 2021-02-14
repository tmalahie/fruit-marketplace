import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className="title">
              Fruit MarketPlace
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="page">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/login/:type">
              <Login />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
