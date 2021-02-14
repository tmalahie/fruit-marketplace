import './MarketPlace.css';
import LoggedInUser from '../../components/LoggedInUser/LoggedInUser'

function MarketPlace({ user }) {
    return <div className="MarketPlace">
        <LoggedInUser user={user} />
    </div>
}

export default MarketPlace;