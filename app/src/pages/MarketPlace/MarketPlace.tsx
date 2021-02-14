import './MarketPlace.css';
import LoggedInUser from '../../components/LoggedInUser/LoggedInUser'
import { useState, useEffect } from "react";
import { getData } from "../../utils/apiUtils"
import { Button, Typography } from '@material-ui/core';
import OfferView from '../../components/OfferView/OfferView';

export const PERIOD = "week1";

function MarketPlace({ user }) {
    let [currentOffers, setCurrentOffers] = useState(null);

    useEffect(() => {
        async function getOffers() {
            const offers = await getData("/offers?period=" + PERIOD);
            setCurrentOffers(offers);
        }
        getOffers();
    }, [])

    function handleBuy() {
        alert(0);
    }

    return <div className="MarketPlace">
        <LoggedInUser user={user} />
        <div>My current waller: {user.wallet_amount_xrp} XRP</div>
        {currentOffers && <>
            <br />
            <Typography variant="h4" className="title">
                Current offers ({currentOffers.length})
            </Typography>
            {(currentOffers.length > 0) && <div>
                {currentOffers.map(offer => <div>
                    <OfferView offer={offer} />
                    <div className="offerActions">
                        <Button variant="contained" size="small" color="primary" onClick={handleBuy}>Buy</Button>
                    </div>
                    <br />
                </div>)}
            </div>}
            {!currentOffers.length && <div>
                <em>There are currently no available offers. Come back later!</em>
            </div>}
        </>}
    </div>
}

export default MarketPlace;