import { Router } from 'express';
import multer from 'multer';
import { Post, User, Upment, Downment } from '../models/index.js';
import pathmodule from 'path';
import authmiddleware from '../util/authmiddleware.js';

export const path = '/posts';
export const router = Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}__${file.originalname}`);
    },
});
const upload = multer({ storage: storage });


router.get("/list", async (req, res, next) => {

    try {
        const page = Number(req.query.page);
        const perPage = Number(req.query.perPage);

        const posts = await Post.find({ postType: 2, show: true })
        .sort({ createdAt: -1 }) 
        .skip(page) 
        .limit(perPage)
        .populate("author");

        // const total = await Post.countDocuments({postType: 3});
        // const totalPage = Math.ceil(total / perPage); 

        res.status(200).json({ posts });
    } catch(err) {
        err.message = `${err.message}, ootd posts list error.`;
        next(err);
    }
})

// 특정 게시글 불러오기
router.get("/list/:shortId", authmiddleware, async (req, res, next) => {
    let {shortId} = req.params;
    try {
        let data = await Post.findOne({shortId, show: true})
            .populate("author")
            .populate([
                {
                    path: "comments",
                    model: "Upment",
                    populate: {
                        path: "comments author",
                        
                    },
                },
                {
                    path: "comments",
                    model: "Upment",
                    populate: {
                        path: "comments",
                        model: "Downment",
                        populate: {
                            path: "author",
                            model: "User",
                        }
                    },
                },
            ]);
        // 사용자와 게시글 작성자 비교
    if (req.tokenInfo.email !== data.author.email) {
        await Post.updateOne({ shortId }, { $inc: { views: 1}});
        data = await Post.findOne({ shortId, show: true })
            .populate("author")
            .populate([
                {
                    path: "comments",
                    model: "Upment",
                    populate: {
                        path: "comments author",
                    },
                },
                {
                    path: "comments",
                    model: "Upment",
                    populate: {
                        path: "comments",
                        model: "Downment",
                        populate: {
                            path: "author",
                            model: "User",
                        }
                    },
                },
            ]);
        }
        res.status(200).json(data);

    } catch(err){
        err.message = `${err.message} ootd post find error`
        next(err);
    }
});
//게시글 생성
router.post('/create', authmiddleware, upload.single('img'), async function (req, res, next) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    console.log(req.file);
    if (req.file) {
        const email = req.tokenInfo.email
;       const {content, title} = req.body;
        const authData = await User.findOne({email});
        // console.log("--------------------\n\n\n", req.body, "\n2.\n", title, "\n4\n", content);
        const url = req.file.destination + pathmodule.basename(req.file.path);
        await Post.create({
            title: title,
            content: content,
            postType: 2,
            img: {
                url: url,
            },
            author: authData
        });
        res.status(200).json({ data: "게시물 업로드에 성공했습니다!"});
    } else {
        next(new Error("게시물 업로드에 실패하였습니다."));
    }

 });
// 특정 게시글 삭제
 router.delete("/list/:shortId/delete", authmiddleware, async (req, res, next) => {
    const {shortId} = req.params; // 객체이름과 params이름이 같아야 할당이 된다.
    const tokenInfo = req.tokenInfo;
    try {
        //작성자 검증
        if (!tokenInfo) {
            return next(new Error("로그인을 해주세요."));
        }
        const postUserId = await Post.findOne({ shortId }).populate('author');
        if (tokenInfo.email !== postUserId.author.email) {
            return next(new Error("작성자가 아닙니다!"));
        }
        await Post.updateOne({ shortId }, {show: false});
        res.status(200).json({
            result: '삭제가 완료 되었습니다.'
        })
    }catch(err) {
        err.message = `${err.message} ootd post delete error`
        next(err);
    }
})
//특정 게시글 수정
router.put("/list/:shortId/update", authmiddleware, async (req, res, next) => {
    let {shortId} = req.params;
    let {title, content} = req.body;
    const tokenInfo = req.tokenInfo;
    try {
        //작성자 검증
        if (!tokenInfo) {
            return next(new Error("로그인을 해주세요."));
        }
        const postUserId = await Post.findOne({ shortId }).populate('author');
        if (tokenInfo.email !== postUserId.author.email) {
            return next(new Error("작성자가 아닙니다!"));
        }

        await Post.updateOne({shortId}, {
            title,
            content
        })
        res.status(200).json({
            result: '수정이 완료되었습니다.'
        })
    } catch (err) {
        err.message = `${err.message} ootd post update error`
        next(err)
    }

});
// 특정 게시글에 댓글 달기
router.post("/list/:shortId/comment", authmiddleware, async (req, res, next) => {
    const { shortId } = req.params;
    let { comment} = req.body;
    const email = req.tokenInfo.email;
    try {
        const authData = await User.findOne({email});
        const postData = await Post.findOne({shortId}).populate('author');
        
        const newcomment = await Upment.create({
            postType: 2,
            author: authData,
            post_id: postData,
            comment: comment
        });

        await Post.updateOne({shortId}, {"$push": {"comments": newcomment}});
        
        res.status(200).json({
            result: '댓글이 작성 되었습니다.'
        })

    } catch (err) {
        err.message = `${err.message}, ootd post comment error.`;
        next(err);
    }

});

//특정 게시글 댓글에 대댓글 달기
router.post("/list/:shortId/recomment/:p_shortId", authmiddleware, async (req, res, next) => {
    const { shortId, p_shortId } = req.params;
    let { comment} = req.body;
    const email = req.tokenInfo.email;
    try {
        const authData = await User.findOne({email});
        const postData = await Post.findOne({shortId});
        const parentData = await Upment.findOne({shortId: p_shortId});

        const newcomment = await Downment.create({
            postType: 2,
            author: authData,
            post_id: postData,
            parentment_id: parentData,
            comment: comment
        });

        await Upment.updateOne({shortId: p_shortId}, {"$push": {"comments": newcomment}});
        
        res.status(200).json({
            result: '댓글이 작성 되었습니다.'
        })

    } catch (err) {
        err.message = `${err.message}, ootd post recomment error.`;
        next(err);
    }

});