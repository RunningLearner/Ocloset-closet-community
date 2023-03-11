import { Router } from "express";
// import * as example from './example.routes.js';
import * as users from "./users.routes";
import * as closet from "./closet.routes";
import * as posts from "./posts.routes";
import * as market from "./market.routes";
import * as like from "./like.routes";
import * as movepost from "./movepost.routes";
import * as search from "./search.routes";
import * as comment from "./comment.routes";

import authmiddleware from "../util/authmiddleware.js";

console.log("routes loaded!!");

const router = Router();

// router.use(example.path, example.router);
router.use(users.path, users.router);
router.use(closet.path, authmiddleware, closet.router);
router.use(posts.path, posts.router);
router.use(market.path, market.router);
router.use(like.path, authmiddleware, like.router);
router.use(movepost.path, movepost.router);
router.use(search.path, search.router);
router.use(comment.path, authmiddleware, comment.router);

export default router;
