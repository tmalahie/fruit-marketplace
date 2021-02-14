import './OfferEdit.css'
import { FormControl, InputLabel, Input, Button, Link } from '@material-ui/core';
import { formDataToObject } from "../../utils/formUtils"

function OfferEdit({ offer, onValidate, onCancel }) {
    function handleEdit(e) {
        e.preventDefault();
        onValidate(formDataToObject(new FormData(e.target)));
    }

    function handleBack(e) {
        e.preventDefault();
        onCancel();
    }

    return <div className="OfferView">
        <form onSubmit={handleEdit}>
            <div>
                <FormControl>
                    <InputLabel htmlFor="fruit_name">Fruit name</InputLabel>
                    <Input type="text" id="fruit_name" name="fruit_name" aria-describedby="Name" defaultValue={offer.fruit_name} />
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <InputLabel htmlFor="fruit_quantity">Fruit quantity</InputLabel>
                    <Input type="number" id="fruit_quantity" name="fruit_quantity" aria-describedby="Quantity" defaultValue={offer.fruit_quantity} />
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <InputLabel htmlFor="fruit_unit_price_eur">Fruit unit price</InputLabel>
                    <Input type="number" id="fruit_unit_price_eur" name="fruit_unit_price_eur" inputProps={{ "step": 0.01 }} aria-describedby="Unit Price" defaultValue={offer.fruit_unit_price_eur} />
                </FormControl>
            </div>
            <div className="offerEditActions">
                <Button variant="contained" color="primary" type="submit">Validate</Button>
                {'   '}
                <Link href="#" onClick={handleBack}>Cancel</Link>
            </div>
        </form>
    </div>
}

export default OfferEdit;