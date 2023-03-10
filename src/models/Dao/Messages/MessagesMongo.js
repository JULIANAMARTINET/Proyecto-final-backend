import { MongoDBContainer } from "../../../Containers/index.js";
import { MessageModel } from "../../index.js";

export class MessagesMongo extends MongoDBContainer {
  constructor() {
    super({
      name: MessageModel.MessageCollection,
      schema: MessageModel.MessageSchema
    });
  }

}
