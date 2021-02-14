import './LoggedInUser.css'
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core'

function LoggedInUser({ user }) {
    function handleLogOut(e) {
        e.preventDefault();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        document.location.href = "/";
    }

    return <div>
        <Typography variant="h4" className="title">
            Connected as {user.email}
        </Typography>
        <Link href="/" onClick={handleLogOut}>Log out</Link>
    </div>
}

export default LoggedInUser;