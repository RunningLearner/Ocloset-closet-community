import multer from "multer";
import { Post, User } from "../models/index";
import pathmodule from "path";
import { RequestHandler } from "express";
import { DBUser } from "../models/schemas/user";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export const createData: RequestHandler = async function (req, res, next) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  if (req.file) {
    const { type } = req.body;
    const email = req.email;
    const category = JSON.parse(type).dressType;
    const style = JSON.parse(type).styleType;
    const authData = await User.findOne({ email });
    const url = req.file.destination + pathmodule.basename(req.file.path);

    let total;
    if (authData) {
      total = await Post.countDocuments({
        author: authData._id,
        show: true,
        postType: 1,
      });
    }

    if (total) {
      await Post.create({
        postType: 1,
        img: {
          url: url,
          category: category,
          style: style,
        },
        views: total + 1,
        author: authData,
      });
    }
    res.json({ data: "이미지 업로드에 성공했습니다!" });
  } else {
    next(new Error("이미지 업로드에 실패하였습니다. 에러코드 추가필요"));
  }
};

// 옷 정보 불러오기
export const getList: RequestHandler = async (req, res, next) => {
  try {
    const email = req.email;
    const postsData = await Post.find({ postType: 1, show: true })
      .sort({ views: 1 }) //가장 먼저 업데이트된 게시글을 첫번째 인덱스로 가져옴
      .populate<{ author: DBUser }>("author");

    const posts = postsData.reduce((acc: Object[], it) => {
      if (it.author.email == email) {
        return [...acc, it];
      }
      return [...acc];
    }, []);

    res.json({ posts });
  } catch (err: any) {
    err.message = `${err.message}, closet list error.`;
    next(err);
  }
};

//옷정보 삭제
export const deleteData: RequestHandler = async (req, res, next) => {
  const email = req.email;
  const shortId = req.params.shortId;
  try {
    if (!email) {
      return next(new Error("로그인을 해주세요."));
    }
    const postUserId = await Post.findOne({ shortId }).populate<{
      author: DBUser;
    }>("author");

    if (postUserId !== null && email !== postUserId.author.email) {
      return next(new Error("작성자가 아닙니다!"));
    }

    await Post.updateOne({ shortId }, { show: false });

    res.json({ message: "삭제하였습니다." });
  } catch (err: any) {
    err.message = `${err.message}, closet delete error.`;
    next(err);
  }
};

export const updateData: RequestHandler = async (req, res, next) => {
  //top부터 차례대로 옷 리스트를 받는다.
  const { list } = req.body;
  const email = req.email;
  const dressList = Object.values(list);
  try {
    //작성자 검증
    if (!email) {
      return next(new Error("로그인을 해주세요."));
    }
    //옷장의 옷들을 top -> bottom -> shoes -> etc 순으로 update함.
    await Promise.all(
      dressList.map(async (it: any, index) => {
        const shortId = it.shortId;
        //카테고리도 업데이트
        const category = it.img.category;
        const style = it.img.style;
        await Post.updateOne(
          { shortId },
          { img: { category, url: it.img.url, style }, views: index }
        );
      })
    );
    res.json({ message: "옷장 저장에 성공했습니다!" });
  } catch (err: any) {
    err.message = `${err.message} closet update error`;
    next(err);
  }
};
