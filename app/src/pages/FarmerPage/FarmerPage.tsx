import './FarmerPage.css';
import LoggedInUser from '../../components/LoggedInUser/LoggedInUser'
import OfferView from '../../components/OfferView/OfferView'
import OfferEdit from '../../components/OfferEdit/OfferEdit'
import Typography from '@material-ui/core/Typography';
import { useState, useEffect } from "react";
import { getData, postData, putData, deleteData } from "../../utils/apiUtils"
import { Button } from '@material-ui/core';
import { PERIOD } from "../MarketPlace/MarketPlace";

function FarmerPage({ user }) {
    let [currentOffers, setCurrentOffers] = useState(null) as any[];
    let [isEditting, setEditting] = useState(false);

    function startEditting() {
        setEditting(true);
    }
    function stopEditting() {
        setEditting(false);
    }

    function handleCreate(newOffer) {
        setEditting(false);
        setCurrentOffers(null);
        async function createOffer() {
            const createdOffer = await postData("/offers", {
                body: {
                    ...newOffer,
                    period: PERIOD
                }
            });
            setCurrentOffers([createdOffer]);
        }
        createOffer();
    }

    function handleEdit(newOffer) {
        setEditting(false);
        const currentOffer = currentOffers[0];
        setCurrentOffers(null);
        async function updateOffer() {
            const updatedOffer = await putData(`/offers/${currentOffer.id}`, {
                body: newOffer
            });
            setCurrentOffers([updatedOffer]);
        }
        updateOffer();
    }

    function handleDelete() {
        setCurrentOffers([]);
        async function deleteOffer() {
            await deleteData(`/offers/${currentOffer.id}`);
        }
        deleteOffer();
    }

    useEffect(() => {
        async function getOffers() {
            const offers = await getData("/offers/me");
            setCurrentOffers(offers);
        }
        getOffers();
    }, [])

    let currentOffer = currentOffers && currentOffers[0];

    return <div className="FarmerPage">
        <LoggedInUser user={user} />
        {currentOffers && <div>
            <br />
            <Typography variant="h4" className="title">
                My offer
            </Typography>
            {currentOffer && <>
                {!isEditting && <OfferView offer={currentOffer} />}
                {!isEditting && <div className="offerActions">
                    <Button variant="contained" size="small" color="primary" onClick={startEditting}>Edit</Button>
                    {' '}
                    <Button variant="contained" size="small" color="secondary" onClick={handleDelete}>Delete</Button>
                </div>}
                {isEditting && <OfferEdit offer={currentOffer} onValidate={handleEdit} onCancel={stopEditting} />}
            </>}
            {!currentOffer && <>
                <div>You don't have any offer yet</div>
                {!isEditting && <div className="offerActions">
                    <Button variant="contained" size="small" color="primary" onClick={startEditting}>Create one</Button>
                </div>}
                {isEditting && <OfferEdit offer={{}} onValidate={handleCreate} onCancel={stopEditting} />}
            </>}
        </div>}
    </div>
}

export default FarmerPage;