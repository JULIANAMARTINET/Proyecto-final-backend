import { MongoDBContainer } from "../../../Containers/index.js";
import { UserModel } from "../../index.js";

export class UsersMongo extends MongoDBContainer {

  constructor() {
    super({
      name: UserModel.UserCollection,
      schema: UserModel.UserSchema,
    });
  }
}
