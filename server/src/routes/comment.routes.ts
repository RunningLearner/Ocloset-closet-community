import { Router } from "express";
import { updateComment, deleteComment } from "../controller/comment";

export const path = "/comment";
export const router = Router();

router.put("/update/:shortId", updateComment);

router.delete("/delete/:shortId", deleteComment);
