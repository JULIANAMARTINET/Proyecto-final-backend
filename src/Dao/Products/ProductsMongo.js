import { MongoDBContainer } from "../../Containers/index.js";
import { ProductModel } from "../../models/index.js";

export class ProductsMongo extends MongoDBContainer {
  constructor() {
    super({
      name: ProductModel.ProductsCollection,
      schema: ProductModel.ProductSchema,
    });
  }
}
