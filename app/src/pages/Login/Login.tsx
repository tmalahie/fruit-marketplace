import './Login.css';
import { FormControl, InputLabel, Input, Button, Link, Typography } from '@material-ui/core';
import {
    Link as RouterLink,
    useParams
} from "react-router-dom";

function Login() {
    let params = useParams() as any;

    function handleLogIn(e) {
        e.preventDefault();
        // TODO handle log-in
    }

    return <div className="Login">
        <form onSubmit={handleLogIn}>
            <Typography variant="h4" className="title">
                Log in as a {params.type}
            </Typography>
            <div>
                <FormControl>
                    <InputLabel htmlFor="email">Email address</InputLabel>
                    <Input type="email" id="email" aria-describedby="Email" />
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input type="password" id="password" aria-describedby="Password" />
                </FormControl>
            </div>
            <br />
            <div>
                <FormControl>
                    <Button variant="contained" type="submit">Log in</Button>
                </FormControl>
            </div>
        </form>
        <br />
        <Link component={RouterLink} to="/">&lt; Back to home</Link>
    </div>
}

export default Login;