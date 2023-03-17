import { Schema } from "mongoose";

const MessageCollection = "messages";

const MessageSchema = new Schema({
  messagesDataId: {type: Number, require: true},
  entities: {type: Object, require: true},
  result: {type: Array, require: true}
})

MessageSchema.set("toJSON", {
    transform: (_, response) => {
      response.id = response._id;
      delete response._id;
      return response;
    },
  });


export const MessageModel = { MessageCollection, MessageSchema };

