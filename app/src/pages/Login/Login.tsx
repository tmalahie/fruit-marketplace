import './Login.css';
import { useState } from 'react';
import { FormControl, InputLabel, Input, Button, Link, Typography } from '@material-ui/core';
import { postData } from "../../utils/apiUtils";
import Alert from '@material-ui/lab/Alert';
import {
    Link as RouterLink,
    useParams
} from "react-router-dom";

function Login() {
    const params = useParams() as any;
    const [error, setError] = useState(null) as any;

    function handleLogIn(e) {
        e.preventDefault();
        setError(null);
        const form = e.target;
        async function login() {
            const response = await postData("/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "type": params.type,
                    "email": form.elements["email"].value,
                    "password": form.elements["password"].value
                }
            });
            if (response.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
                localStorage.setItem("token", response.token);
                document.location.href = "/";
            }
            else if (response.error)
                setError(response.error);
        }
        login();
    }

    return <div className="Login">
        <form onSubmit={handleLogIn}>
            <Typography variant="h4" className="title">
                Log in as a {params.type}
            </Typography>
            <br />
            {error && <Alert severity="warning">{error.message}</Alert>}
            <br />
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