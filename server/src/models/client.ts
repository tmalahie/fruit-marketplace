import Model, { DefaultColumns } from "../utils/db/model";

export type Client = DefaultColumns & {
    wallet_amount_xrp: number
};
class EntityModel extends Model<Client> {
    constructor() {
        super({
            tableName: "client",
            requiredProps: ["wallet_amount_xrp"],
            optionalProps: [],
        });
    }
}
export const ClientModel = new EntityModel();
export const ClientColumns = ClientModel.columns;