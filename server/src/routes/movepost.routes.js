import { Router } from 'express';
import { Post } from '../models/index.js'

export const path = '/movepost';
export const router = Router();

router.get("/nextpost", async (req, res, next) => {
    const {shortId, postType} = req.query;
    try {
        const allData = await Post.find({postType, show: true}).sort("createdAt");
        const idx = allData.findIndex( (element) => element.shortId === shortId);
        const targetData = allData[idx + 1];
        res.json({targetData});
    } catch(err) {
        next(err);
    }
});

router.get("/prevpost", async (req, res, next) => {
    const {shortId, postType} = req.query;
    try {
        const allData = await Post.find({postType, show: true}).sort("createdAt");
        const idx = allData.findIndex( (element) => element.shortId === shortId);
        const targetData = allData[idx - 1];
        res.json({targetData});
    } catch(err) {
        next(err);
    }
});