import { Router } from "express";
import authmiddleware from "../util/authmiddleware.js";
import {
  createComment,
  createPost,
  createReply,
  deletePost,
  getList,
  getPost,
  updatePost,
} from "../controller/post";

export const path = "/posts";
export const router = Router();

router.get("/list", getList);

// 특정 게시글 불러오기
router.get("/list/:shortId", authmiddleware, getPost);
//게시글 생성
router.post("/create", authmiddleware, createPost);
// 특정 게시글 삭제
router.delete("/list/:shortId/delete", authmiddleware, deletePost);
//특정 게시글 수정
router.put("/list/:shortId/update", authmiddleware, updatePost);
// 특정 게시글에 댓글 달기
router.post("/list/:shortId/comment", authmiddleware, createComment);

//특정 게시글 댓글에 대댓글 달기
router.post("/list/:shortId/recomment/:p_shortId", authmiddleware, createReply);
