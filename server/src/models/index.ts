import mongoose from "mongoose";
import PostSchema, { IPost } from "./schemas/post";
import UserSchema, { IUser } from "./schemas/user";
import UpmentSchema, { IUpment } from "./schemas/upment";
import DownmentSchema from "./schemas/downment";
import LikeSchema from "./schemas/like";
import DislikeSchema from "./schemas/dislike";

export const Post = mongoose.model<IPost>("Post", PostSchema);
export const User = mongoose.model<IUser>("User", UserSchema);
export const Upment = mongoose.model<IUpment>("Upment", UpmentSchema);
export const Downment = mongoose.model("Downment", DownmentSchema);
export const Like = mongoose.model("Like", LikeSchema);
export const Dislike = mongoose.model("Dislike", DislikeSchema);
