import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ShopIcon from '@material-ui/icons/Shop';
import PersonIcon from '@material-ui/icons/Person';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="title">
            Fruit MarketPlace
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" className="title">
        Welcome to the fruit marketplace.
      </Typography>
      <div className="MainButtons">
        <Button variant="contained" size="large"><ShopIcon /> Log in as farmer</Button>
        <Button variant="contained" color="primary" size="large"><PersonIcon /> Log in as client</Button>
      </div>
    </div>
  );
}

export default App;
