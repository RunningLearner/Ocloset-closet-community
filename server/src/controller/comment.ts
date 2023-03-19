import { RequestHandler, Router } from "express";
import { Upment, Downment } from "../models/index";
import { IUser } from "../models/schemas/user";

export const path = "/comment";
export const router = Router();

export const updateComment: RequestHandler = async (req, res, next) => {
  const { content } = req.body;
  const { shortId } = req.params;
  const email = req.email;
  let comment;

  try {
    comment = await Upment.findOne({ _id: shortId });
    if (comment) {
      //작성자 검증
      if (!email) {
        return next(new Error("로그인을 해주세요."));
      }
      const postUserId = await Upment.findOne({ shortId }).populate<{
        author: IUser;
      }>("author");
      if (postUserId && email !== postUserId.author.email) {
        return next(new Error("작성자가 아닙니다!"));
      }

      await Upment.updateOne({ _id: shortId }, { comment: content });
      res.status(200).json({ result: "수정이 완료되었습니다." });
    } else {
      if (!email) {
        return next(new Error("로그인을 해주세요."));
      }
      const postUserId = await Downment.findOne({ shortId }).populate<{
        author: IUser;
      }>("author");
      if (postUserId && email !== postUserId.author.email) {
        return next(new Error("작성자가 아닙니다!"));
      }
      await Downment.updateOne({ _id: shortId }, { comment: content });
      res.status(200).json({ result: "수정이 완료되었습니다." });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
  const { shortId } = req.params;
  const email = req.email;
  let comment;

  try {
    comment = await Upment.findOne({ shortId });
    if (comment) {
      //작성자 검증
      if (!email) {
        return next(new Error("로그인을 해주세요."));
      }
      const postUserId = await Upment.findOne({ shortId }).populate<{
        author: IUser;
      }>("author");
      if (postUserId && email !== postUserId.author.email) {
        return next(new Error("작성자가 아닙니다!"));
      }

      await Upment.updateOne({ _id: shortId }, { show: false });
      res.status(200).json({ result: "삭제가 완료되었습니다." });
    } else {
      if (!email) {
        return next(new Error("로그인을 해주세요."));
      }
      const postUserId = await Downment.findOne({ shortId }).populate<{
        author: IUser;
      }>("author");
      if (postUserId && email !== postUserId.author.email) {
        return next(new Error("작성자가 아닙니다!"));
      }

      await Downment.updateOne({ _id: shortId }, { show: false });
      res.status(200).json({ result: "삭제가 완료되었습니다." });
    }
  } catch (err) {
    next(err);
  }
};
