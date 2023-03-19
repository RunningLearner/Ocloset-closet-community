import { RequestHandler, Router } from "express";
import { Post, User } from "../models/index";
import { IUser } from "../models/schemas/user";

export const path = "/search";
export const router = Router();

export const searchPost: RequestHandler = async (req, res, next) => {
  const postType = req.query.postType;
  const page = Number(req.query.page);
  const perPage = Number(req.query.perPage);

  try {
    let options = [];
    if (req.query.option == "제목") {
      options = [{ title: new RegExp(req.query.content as string) }];
    } else if (req.query.option == "내용") {
      options = [{ content: new RegExp(req.query.content as string) }];
    } else if (req.query.option == "제목 내용") {
      options = [
        { title: new RegExp(req.query.content as string) },
        { content: new RegExp(req.query.content as string) },
      ];
    } else if (req.query.option == "작성자") {
      const authorData = await User.find({
        name: new RegExp(req.query.content as string),
      });
      console.log(authorData);
      const authorIdData = authorData.reduce(
        (acc: { author: string }[], it: IUser) => {
          return [{ author: JSON.stringify(it._id) }, ...acc];
        },
        []
      );
      options = authorIdData;
      console.log(options);
    } else {
      throw new Error("검색 옵션이 없습니다.");
    }

    const result = await Post.find({ postType, show: true })
      .populate("author")
      .find({ $or: options })
      .sort({ createdAt: -1 }) //마지막으로 작성된 게시글을 첫번째 인덱스로 가져옴
      .skip(page) //ex> 2페이지라면 5번부터
      .limit(perPage); // 6개씩 가져와줘.

    res.status(200).json({ posts: result });
  } catch (err) {
    next(err);
  }
};
