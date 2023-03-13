import { Router } from "express";
import * as users from "./user.routes";
import * as closet from "./closet.routes";
import * as posts from "./post.routes";
// import * as market from "./market.routes.js";
// import * as like from "./like.routes.js";
// import * as movepost from "./movepost.routes.js";
// import * as search from "./search.routes.js";
// import * as comment from "./comment.routes.js";

import authmiddleware from "../util/authmiddleware";

console.log("routes loaded!!");

const router = Router();

router.use(users.path, users.router);
router.use(closet.path, authmiddleware, closet.router);
router.use(posts.path, posts.router);
// router.use(market.path, market.router);
// router.use(like.path, authmiddleware, like.router);
// router.use(movepost.path, movepost.router);
// router.use(search.path, search.router);
// router.use(comment.path, authmiddleware, comment.router);

export default router;
