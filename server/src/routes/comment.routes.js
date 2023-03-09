import { Router } from 'express';
import { Post, Upment, Downment } from '../models/index.js'

export const path = '/comment';
export const router = Router();

router.put("/update/:shortId", async (req, res, next) => {
    const {content} = req.body;
    const { shortId } = req.params;
    const tokenInfo = req.tokenInfo;
    let comment = {};

    try {       
        comment = await Upment.findOne({shortId});
        if (comment) {
            //작성자 검증 
            if (!tokenInfo) {
                return next(new Error("로그인을 해주세요."));
            }
            const postUserId = await Upment.findOne({ shortId }).populate('author');
            if (tokenInfo.email !== postUserId.author.email) {
                return next(new Error("작성자가 아닙니다!"));
            }

            await Upment.updateOne({shortId}, { comment: content});
            res.status(200).json({ result: "수정이 완료되었습니다."});

        } else {
            if (!tokenInfo) {
                return next(new Error("로그인을 해주세요."));
            }
            const postUserId = await Downment.findOne({ shortId }).populate('author');
            if (tokenInfo.email !== postUserId.author.email) {
                return next(new Error("작성자가 아닙니다!"));
            }
            await Downment.updateOne({shortId}, { comment: content});
            res.status(200).json({ result: "수정이 완료되었습니다."});

        }
    } catch (err) {
        next(err)
    }
});

router.delete("/delete/:shortId", async (req, res, next) => {
    const { shortId } = req.params;
    const tokenInfo = req.tokenInfo;
    let comment = {};

    try {       
        comment = await Upment.findOne({shortId});
        if (comment) {
            //작성자 검증 
            if (!tokenInfo) {
                return next(new Error("로그인을 해주세요."));
            }
            const postUserId = await Upment.findOne({ shortId }).populate('author');
            if (tokenInfo.email !== postUserId.author.email) {
                return next(new Error("작성자가 아닙니다!"));
            }

            await Upment.updateOne({shortId}, {show: false});
            res.status(200).json({ result: "삭제가 완료되었습니다."});

        } else {
            if (!tokenInfo) {
                return next(new Error("로그인을 해주세요."));
            }
            const postUserId = await Downment.findOne({ shortId }).populate('author');
            if (tokenInfo.email !== postUserId.author.email) {
                return next(new Error("작성자가 아닙니다!"));
            }
            
            await Downment.updateOne({shortId}, {show: false});
            res.status(200).json({ result: "삭제가 완료되었습니다."});

        }
        
    } catch (err) {
        next(err)
    }
});