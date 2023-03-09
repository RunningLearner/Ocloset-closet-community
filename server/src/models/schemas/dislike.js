import mongoose from "mongoose";

const DislikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    upmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upment",
    },
    downmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Downment",
    }
}, {
    timestamps: true
})

export default DislikeSchema;