import mongoose from "mongoose";
import PostSchema from "./schemas/post";
import UserSchema from "./schemas/user";
import UpmentSchema from "./schemas/upment";
import DownmentSchema from "./schemas/downment";
import LikeSchema from "./schemas/like";
import DislikeSchema from "./schemas/dislike";

export const Post = mongoose.model("Post", PostSchema);
export const User = mongoose.model("User", UserSchema);
export const Upment = mongoose.model("Upment", UpmentSchema);
export const Downment = mongoose.model("Downment", DownmentSchema);
export const Like = mongoose.model("Like", LikeSchema);
export const Dislike = mongoose.model("Dislike", DislikeSchema);
