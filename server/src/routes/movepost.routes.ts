import { Router } from "express";
import { nextPost, prevPost } from "../controller/movepost";

export const path = "/movepost";
export const router = Router();

router.get("/nextpost", nextPost);

router.get("/prevpost", prevPost);
