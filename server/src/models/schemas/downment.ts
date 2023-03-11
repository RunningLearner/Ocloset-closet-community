import mongoose from "mongoose";
import shortId from "./type/shortId.js";

const DownmentSchema = new mongoose.Schema(
  {
    shortId,
    comment: String,
    show: {
      type: Boolean,
      default: true,
    },
    // 옷장:1, OOTD:2, 당근마켓:3
    postType: {
      type: Number,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upment",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default DownmentSchema;
