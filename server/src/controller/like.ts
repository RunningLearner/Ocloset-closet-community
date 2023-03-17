import { RequestHandler, Router } from "express";
import { Types } from "mongoose";
import { Dislike, Downment, Like, Post, Upment, User } from "../models/index";
import { IUser } from "../models/schemas/user";

export const path = "/like";
export const router = Router();

//좋아요 가져오기
export const getLike: RequestHandler = async (req, res, next) => {
  try {
    let postData = null;
    let upmentData = null;
    let downmentData = null;
    if (req.query.postId) {
      const postId = req.query.postId;
      postData = await Post.findOne({ shortId: postId });
    } else if (req.query.upmentId) {
      const upmentId = req.query.upmentId;
      upmentData = await Upment.findOne({ shortId: upmentId });
    } else {
      const downmentId = req.query.downmentId;
      downmentData = await Downment.findOne({ shortId: downmentId });
    }

    const likes = await Like.find({
      postId: postData,
      upmentId: upmentData,
      downmentId: downmentData,
    }).populate<{ userId: IUser }>("userId");

    let likesData: string[] | undefined;
    if (likes && likes.length > 0) {
      likesData = likes.reduce<string[]>((acc, it) => {
        if (it.userId && it.userId.email) {
          return [it.userId.email, ...acc];
        }
        return acc;
      }, []);
    } else {
      throw new Error("좋아요 정보를 찾을 수 없습니다.");
    }

    res.status(200).json(likesData);
  } catch (err: any) {
    err.message = `${err.message}, get like error.`;
    next(err);
  }
};

//싫어요 가져오기
export const getDisLike: RequestHandler = async (req, res, next) => {
  try {
    let postData = null;
    let upmentData = null;
    let downmentData = null;
    if (req.query.postId) {
      const postId = req.query.postId;
      postData = await Post.findOne({ shortId: postId });
    } else if (req.query.upmentId) {
      const upmentId = req.query.upmentId;
      upmentData = await Upment.findOne({ shortId: upmentId });
    } else {
      const downmentId = req.query.downmentId;
      downmentData = await Downment.findOne({ shortId: downmentId });
    }

    const dislikes = await Dislike.find({
      postId: postData,
      upmentId: upmentData,
      downmentId: downmentData,
    }).populate<{ userId: IUser }>("userId");

    const dislikesData = dislikes.reduce<string[]>((acc, it) => {
      return [it.userId.email, ...acc];
    }, []);

    res.status(200).json(dislikesData);
  } catch (err: any) {
    err.message = `${err.message}, get dislike error.`;
    next(err);
  }
};

//좋아요 누르기
export const upLike: RequestHandler = async (req, res, next) => {
  const email = req.email;
  try {
    const userData = await User.findOne({ email: email });
    let postData = null;
    let upmentData = null;
    let downmentData = null;
    if (req.body.postId) {
      const postId = req.body.postId;
      postData = await Post.findOne({ shortId: postId });
    } else if (req.body.upmentId) {
      const upmentId = req.body.upmentId;
      upmentData = await Upment.findOne({ shortId: upmentId });
    } else {
      const downmentId = req.body.downmentId;
      downmentData = await Downment.findOne({ shortId: downmentId });
    }

    const liked = await Like.findOne({
      userId: userData,
      postId: postData,
      upmentId: upmentData,
      downmentId: downmentData,
    });

    const disliked = await Dislike.findOne({
      userId: userData,
      postId: postData,
      upmentId: upmentData,
      downmentId: downmentData,
    });

    if (liked) {
      await Like.findOneAndDelete({ _id: liked._id });
      return res.status(200).json({ liked: false, disliked: false });
    } else if (disliked) {
      await Dislike.findOneAndDelete({ _id: disliked._id });
      await Like.create({
        userId: userData,
        postId: postData,
        upmentId: upmentData,
        downmentId: downmentData,
      });
      return res.status(200).json({ liked: true, disliked: false });
    } else {
      await Like.create({
        userId: userData,
        postId: postData,
        upmentId: upmentData,
        downmentId: downmentData,
      });
      return res.status(200).json({ liked: true, disliked: false });
    }
  } catch (err: any) {
    err.message = `${err.message}, post like error.`;
    next(err);
  }
};

//싫어요 누르기
export const updislike: RequestHandler = async (req, res, next) => {
  const email = req.email;

  try {
    const userData = await User.findOne({ email: email });
    let postData = null;
    let upmentData = null;
    let downmentData = null;
    if (req.body.postId) {
      const postId = req.body.postId;
      postData = await Post.findOne({ shortId: postId });
    } else if (req.body.upmentId) {
      const upmentId = req.body.upmentId;
      upmentData = await Upment.findOne({ shortId: upmentId });
    } else {
      const downmentId = req.body.downmentId;
      downmentData = await Downment.findOne({ shortId: downmentId });
    }

    const liked = await Like.findOne({
      userId: userData,
      postId: postData,
      upmentId: upmentData,
      downmentId: downmentData,
    });
    const disliked = await Dislike.findOne({
      userId: userData,
      postId: postData,
      upmentId: upmentData,
      downmentId: downmentData,
    });

    if (disliked) {
      await Dislike.findOneAndDelete({ _id: disliked._id });
      return res.status(200).json({ liked: false, disliked: false });
    } else if (liked) {
      await Like.findOneAndDelete({ _id: liked._id });
      await Dislike.create({
        userId: userData,
        postId: postData,
        upmentId: upmentData,
        downmentId: downmentData,
      });
      return res.status(200).json({ liked: false, disliked: true });
    } else {
      await Dislike.create({
        userId: userData,
        postId: postData,
        upmentId: upmentData,
        downmentId: downmentData,
      });
      return res.status(200).json({ liked: false, disliked: true });
    }
  } catch (err: any) {
    err.message = `${err.message}, post dislike error.`;
    next(err);
  }
};
