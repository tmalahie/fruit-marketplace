import ObjectUtils from "../utils/objectUtils";
import Model, { DefaultColumns } from "../utils/db/model";

export type Offer = DefaultColumns & {
  farmer_id: string;
  fruit_name: string;
  fruit_quantity: number;
  fruit_unit_price_eur: number;
  period: string;
};
class EntityModel extends Model<Offer> {
  constructor() {
    super({
      tableName: "offer",
      requiredProps: ["farmer_id", "fruit_name", "fruit_quantity", "fruit_unit_price_eur", "period"],
      optionalProps: [],
    });
  }
}
export const OfferModel = new EntityModel();
export const OfferColumns = OfferModel.columns;

export const getEntityFromInputs = (
  inputs: any,
  columns: string[] = OfferModel.columnNames
): Partial<Offer> => ObjectUtils.subKeys(inputs, columns);
