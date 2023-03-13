import mongoose, { Types } from "mongoose";
import shortId from "./type/shortId.js";

export interface IUser {
  _id: Types.ObjectId;
  // shortId: string;
  email: string;
  password: string;
  name: string;
  status: boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    // shortId,
    email: String,
    password: String,
    name: String,
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default UserSchema;
