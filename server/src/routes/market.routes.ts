import { Router } from "express";
import {
  createComment,
  createPost,
  createReply,
  deletePost,
  getList,
  updatePost,
} from "../controller/market";
import { getPost } from "../controller/post";
import authmiddleware from "../util/authmiddleware";
import { upload } from "../util/upload";

export const path = "/market";
export const router = Router();

// 게시글 생성하기
router.post("/create", authmiddleware, upload.single("imageFile"), createPost);

//게시글 목록 불러오기
router.get("/list", getList);

//특정 게시글 불러오기
router.get("/list/:shortId", authmiddleware, getPost);

//특정 게시글 수정
router.put("/list/:shortId/update", authmiddleware, updatePost);

//특정 게시글 삭제
router.delete("/list/:shortId/delete", authmiddleware, deletePost);

//특정 게시글에 댓글달기
router.post("/list/:shortId/comment", authmiddleware, createComment);

//특정 게시글 댓글에 대댓글 달기
router.post("/list/:shortId/recomment/:p_shortId", authmiddleware, createReply);
