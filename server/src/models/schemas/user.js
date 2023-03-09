import mongoose from "mongoose";
import shortId from "./type/shortId.js";

const UserSchema = new mongoose.Schema({
    shortId,
    email: String,
    password: String,
    name: String,
    status: false
}, {
    timestamps: true
})

export default UserSchema;