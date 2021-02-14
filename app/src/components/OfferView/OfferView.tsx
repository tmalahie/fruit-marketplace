import './OfferView.css'

function OfferView({ offer }) {
    return <div className="OfferView">
        <div className="OfferFeatures">
            <div>
                <div>Fruit name:</div>
                <div>{offer.fruit_name}</div>
            </div>
            <div>
                <div>Fruit quantity:</div>
                <div>{offer.fruit_quantity}</div>
            </div>
            <div>
                <div>Fruit unit price:</div>
                <div>{offer.fruit_unit_price_eur}</div>
            </div>
        </div>
    </div>
}

export default OfferView;