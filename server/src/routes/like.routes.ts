import { Router } from "express";
import { getDisLike, getLike, updislike, upLike } from "../controller/like";

export const path = "/like";
export const router = Router();

//좋아요 가져오기
router.get("/getlikes", getLike);

//싫어요 가져오기
router.get("/getdislikes", getDisLike);

//좋아요 누르기
router.post("/uplike", upLike);

//싫어요 누르기
router.post("/updislike", updislike);
