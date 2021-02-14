import './FarmerPage.css';
import LoggedInUser from '../../components/LoggedInUser/LoggedInUser'

function FarmerPage({ user }) {
    return <div className="FarmerPage">
        <LoggedInUser user={user} />
    </div>
}

export default FarmerPage;