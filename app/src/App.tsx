import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import FarmerPage from './pages/FarmerPage/FarmerPage';
import MarketPlace from './pages/MarketPlace/MarketPlace';
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
  let userJson = localStorage.getItem("user");
  let user = userJson && JSON.parse(userJson);
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
              {!user && <Home />}
              {(user && user.type === "farmer") && <FarmerPage user={user} />}
              {(user && user.type === "client") && <MarketPlace user={user} />}
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
