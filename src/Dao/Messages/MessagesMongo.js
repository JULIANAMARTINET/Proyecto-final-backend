import { MongoDBContainer } from "../../Containers/index.js";
import { MessageModel } from "../../models/index.js";

export class MessagesMongo extends MongoDBContainer {
  constructor() {
    super({
      name: MessageModel.MessageCollection,
      schema: MessageModel.MessageSchema
    });
  }

}
