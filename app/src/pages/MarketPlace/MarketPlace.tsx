import './MarketPlace.css';
import LoggedInUser from '../../components/LoggedInUser/LoggedInUser'
import { useState, useEffect, useCallback } from "react";
import { getData, putData } from "../../utils/apiUtils"
import { Button, Typography } from '@material-ui/core';
import OfferView from '../../components/OfferView/OfferView';

export const PERIOD = "week1";

function MarketPlace({ user }) {
    let [currentOffers, setCurrentOffers] = useState(null) as any[];
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({} as any), []);

    async function loadData() {
        const newUser = await getData(`/users/me`);
        localStorage.setItem("user", JSON.stringify(newUser));
        Object.assign(user, newUser);
        const offers = await getData("/offers?period=" + PERIOD);
        setCurrentOffers(offers);
    }

    useEffect(() => {
        loadData();
    }, [])

    function handleBuy(offer) {
        setCurrentOffers(null);
        async function buyOffer() {
            await putData(`/offers/${offer.id}/buy`);
            await loadData();
            forceUpdate();
        }
        buyOffer();
    }

    return <div className="MarketPlace">
        <LoggedInUser user={user} />
        <div>My current wallet: {user.wallet_amount_xrp} XRP</div>
        {currentOffers && <>
            <br />
            <Typography variant="h4" className="title">
                Current offers ({currentOffers.length})
            </Typography>
            {(currentOffers.length > 0) && <div>
                {currentOffers.map(offer => <div>
                    <OfferView offer={offer} />
                    {(offer.fruit_total_price_xrp <= user.wallet_amount_xrp) && <div className="offerActions">
                        <Button variant="contained" size="small" color="primary" onClick={() => handleBuy(offer)}>Buy</Button>
                    </div>}
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