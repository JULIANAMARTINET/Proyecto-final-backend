import { MongoDBContainer } from "../../../Containers/index.js";
import { CartModel } from "../../index.js";

export class CartsMongo extends MongoDBContainer {
  constructor() {
    super({
      name: CartModel.CartCollection,
      schema: CartModel.CartSchema,
    });
  }

  async getById(id) {
    const response = await this.model.findById(id).populate("products.product");

    return response;
  }
}
