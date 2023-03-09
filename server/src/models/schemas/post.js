import mongoose from "mongoose";
import shortId from "./type/shortId.js";

const PostSchema = new mongoose.Schema(
  {
    shortId,
    title: String,
    content: String,
    show: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    price: Number, //당마용
    // 옷장:1, OOTD:2, 당근마켓:3
    postType: {
      type: Number,
      required: true,
    },
    // url: 이미지 주소, category: [top, bottom, shoes], style: suit/ casual
    img: {
      url: {
        type: String,
        required: true,
      },
      category: String,
      style: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default PostSchema;
