import './Home.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ShopIcon from '@material-ui/icons/Shop';
import PersonIcon from '@material-ui/icons/Person';
import {
    Link
} from "react-router-dom";

function Home() {
    return <div className="Home">
        <Typography variant="h4" className="title">
            Welcome to the fruit marketplace.
        </Typography>
        <div className="MainButtons">
            <Button component={Link} to="/login/farmer" variant="contained" size="large"><ShopIcon /> Log in as farmer</Button>
            <Button component={Link} to="/login/client" variant="contained" color="primary" size="large"><PersonIcon /> Log in as client</Button>
        </div>
    </div>
}

export default Home;