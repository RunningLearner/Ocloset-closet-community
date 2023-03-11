import mongoose from "mongoose";
import shortId from "./type/shortId.js";

interface User {
  shortId: String;
  email: String;
  password: String;
  name: String;
  status: boolean;
}

const UserSchema = new mongoose.Schema<User>(
  {
    shortId,
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
