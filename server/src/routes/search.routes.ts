import { Router } from "express";
import { searchPost } from "../controller/search";

export const path = "/search";
export const router = Router();

router.get("/", searchPost);
