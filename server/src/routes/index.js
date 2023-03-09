import { Router } from 'express';
// import * as example from './example.routes.js';
import * as users from './users.routes.js';
import * as closet from './closet.routes.js';
import * as posts from './posts.routes.js';
import * as market from './market.routes.js';
import * as like from './like.routes.js';
import * as movepost from './movepost.routes.js';
import * as search from './search.routes.js'
import * as comment from './comment.routes.js'

import authmiddleware from '../util/authmiddleware.js';

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