import Model, { DefaultColumns } from "../utils/db/model";

export type Farmer = DefaultColumns & {
};
class EntityModel extends Model<Farmer> {
    constructor() {
        super({
            tableName: "farmer",
            requiredProps: [],
            optionalProps: [],
        });
    }
}
export const FarmerModel = new EntityModel();
export const FarmerColumns = FarmerModel.columns;