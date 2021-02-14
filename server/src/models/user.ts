import Model, { DefaultColumns } from "../utils/db/model";
import { ClientModel } from "./client";

export enum UserType {
    FARMER = "farmer",
    CLIENT = "client"
}

export type User = DefaultColumns & {
    email: string;
    password: string;
    type: UserType;
};
class EntityModel extends Model<User> {
    constructor() {
        super({
            tableName: "user",
            requiredProps: ["email", "password", "type"],
            optionalProps: [],
        });
    }

    async serialize(user: User) {
        let res: any = {
            id: user.id,
            email: user.email,
            type: user.type
        }
        if (user.type === UserType.CLIENT) {
            const client = await ClientModel.findById(user.id);
            res.wallet_amount_xrp = client.wallet_amount_xrp;
        }
        return res;
    }
}
export const UserModel = new EntityModel();
export const UserColumns = UserModel.columns;
