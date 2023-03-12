import mongoose, { Types } from "mongoose";

export interface IUpment {
  _id: Types.ObjectId;
  comment: string;
  show?: boolean;
  postType: number;
  author: Types.ObjectId;
  post_id: Types.ObjectId;
  comments?: Types.ObjectId[];
}

const UpmentSchema = new mongoose.Schema(
  {
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
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Downment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default UpmentSchema;
