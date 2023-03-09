import mongoose from "mongoose"
import PostSchema from "./schemas/post.js"
import UserSchema from "./schemas/user.js"
import UpmentSchema from "./schemas/upment.js";
import DownmentSchema from "./schemas/downment.js";
import LikeSchema from "./schemas/like.js";
import DislikeSchema from "./schemas/dislike.js";

export const Post = mongoose.model("Post", PostSchema);
export const User = mongoose.model("User", UserSchema);
export const Upment = mongoose.model("Upment", UpmentSchema);
export const Downment = mongoose.model("Downment", DownmentSchema);
export const Like = mongoose.model("Like", LikeSchema);
export const Dislike = mongoose.model("Dislike", DislikeSchema);


