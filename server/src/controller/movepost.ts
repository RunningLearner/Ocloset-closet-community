import { RequestHandler, Router } from "express";
import { Post } from "../models/index";

export const nextPost: RequestHandler = async (req, res, next) => {
  const { _id, postType } = req.query;
  try {
    const allData = await Post.find({ postType, show: true }).sort("createdAt");
    const idx = allData.findIndex(
      (element) => JSON.stringify(element._id) === _id
    );
    const targetData = allData[idx + 1];
    res.json({ targetData });
  } catch (err) {
    next(err);
  }
};

export const prevPost: RequestHandler = async (req, res, next) => {
  const { _id, postType } = req.query;
  try {
    const allData = await Post.find({ postType, show: true }).sort("createdAt");
    const idx = allData.findIndex(
      (element) => JSON.stringify(element._id) === _id
    );
    const targetData = allData[idx - 1];
    res.json({ targetData });
  } catch (err) {
    next(err);
  }
};
