import { Schema } from "mongoose";

const UserCollection = "users";

const UserSchema = new Schema(
  {
    name: String,
    lastname: String,
    age: Number,
    phone: Number,
    adress: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    cart: { type: Schema.Types.ObjectId, ref: "carts" },
  },
  { virtuals: true }
);

UserSchema.set("toJSON", {
  transform: (_, response) => {
    response.id = response._id;
    delete response.__v;
    delete response._id;
    return response;
  },
});

export const UserModel = { UserCollection, UserSchema };
