import { Router } from 'express';
import multer from 'multer';
import { Downment, Post, Upment, User } from '../models/index.js'
import pathmodule from 'path';
import authmiddleware from '../util/authmiddleware.js';


export const path = '/market';
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

// 게시글 생성하기
router.post('/create', authmiddleware, upload.single('img'), async function (req, res, next) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    console.log(req.file);
    if (req.file) {
        const email = req.tokenInfo.email;
        const title = req.body.title;
        const content = req.body.content;
        const price = Number(req.body.price);
        const authData = await User.findOne({email});
        const url = req.file.destination + pathmodule.basename(req.file.path);


        // console.log("--------------------\n\n\n", req.body, "\n2.\n", type,"\n3\n", email,"\n4\n", postType);
        await Post.create({
            postType: 3,
            price: price,
            title: title,
            content: content,
            img: {
                   url: url
            },
            author: authData
        });
        res.status(200).json({ data: "게시글 업로드에 성공했습니다!"});
    } else {
        next(new Error("게시글 업로드에 실패하였습니다. 에러코드 추가필요"));
    }

 });

//게시글 목록 불러오기
router.get("/list", async (req, res, next) => {
    try {
        const page = Number(req.query.page);
        const perPage = Number(req.query.perPage);
    
        const posts = await Post.find({ postType: 3, show: true })
        .sort({ createdAt: -1 }) //마지막으로 작성된 게시글을 첫번째 인덱스로 가져옴
        .skip(page) //ex> 2페이지라면 5번부터
        .limit(perPage) // 6개씩 가져와줘.
        .populate("author");
        
    
        res.status(200).json({ posts });
    } catch(err) {
        err.message = `${err.message}, market listing error.`;
        next(err);
    }

});

//특정 게시글 불러오기
router.get("/list/:shortId", authmiddleware, async (req, res, next) => {
    let { shortId } = req.params;

    try {
        
        //shortId의 맞는 데이터를 가져옵니다. (title과 content를 가져옵니다)
        let data = await Post.findOne({ shortId: shortId, show: true })
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
            await Post.updateOne({ shortId: shortId }, { $inc: { views: 1}});
            data = await Post.findOne({ shortId: shortId, show: true })
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
            return res.status(200).json(data);
        }    
        //가져온 데이터를 json형태로 응답합니다.
        res.status(200).json(data);

    } catch (err) {
        err.message = `${err.message}, market post find error.`;
        next(err);
    }

});

//특정 게시글 수정
router.put("/list/:shortId/update", authmiddleware, async (req, res, next) => {
    let { shortId } = req.params;
    let { title, content, price } = req.body;
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
       // shortId가 같은 데이터를 title, content를 update시켜줍니다.
       await Post.updateOne({ shortId }, {
            title,
            content,
            price
        });


        //만약 업데이트가 완료가 되면 json형태의 데이터를 응답해줍니다.
        res.status(200).json({
            result: "수정이 완료되었습니다."
        })

    } catch (err) {
        err.message = `${err.message}, market post update error.`;
        next(err);
    }

});

//특정 게시글 삭제
router.delete("/list/:shortId/delete", authmiddleware, async (req, res, next) => {

    //shortId를 파라미터를 통해 가져옵니다.
    const { shortId } = req.params;
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
        //shortId에 해당하는 document를 삭제합니다.
        await Post.updateOne({ shortId }, {show: false});

        //만약 오류가 나지 않고 삭제를 완료했다면, json형태를 응답해줍니다.
        res.status(200).json({
            result: '삭제가 완료 되었습니다.'
        })

    } catch (err) {
        err.message = `${err.message}, market post delete error.`;
        next(err);
    }
});

//특정 게시글에 댓글달기
router.post("/list/:shortId/comment", authmiddleware, async (req, res, next) => {
    const { shortId } = req.params;
    const { comment } = req.body;
    const email = req.tokenInfo.email;
    
    try {
        const authData = await User.findOne({email});
        const postData = await Post.findOne({shortId});
        
        const newcomment = await Upment.create({
            postType: 3,
            author: authData,
            post_id: postData,
            comment: comment
        });
        
        // console.log(commentData);

        await Post.updateOne({shortId}, {"$push": {"comments": newcomment._id}});
        
        res.status(200).json({
            result: '댓글이 작성 되었습니다.'
        })

    } catch (err) {
        err.message = `${err.message}, market post comment error.`;
        next(err);
    }

});

//특정 게시글 댓글에 대댓글 달기
router.post("/list/:shortId/recomment/:p_shortId", authmiddleware, async (req, res, next) => {
    const { shortId, p_shortId } = req.params;
    const { comment } = req.body;
    const email = req.tokenInfo.email;

    try {
        const authData = await User.findOne({email});
        const postData = await Post.findOne({shortId});
        const parentData = await Upment.findOne({shortId: p_shortId});

        const newcomment = await Downment.create({
            postType: 3,
            author: authData,
            post_id: postData,
            parentment_id: parentData,
            comment: comment
        });

        await Upment.updateOne({shortId: p_shortId}, {"$push": {"comments": newcomment._id}});

        res.status(200).json({
            result: '댓글이 작성 되었습니다.'
        })

    } catch (err) {
        err.message = `${err.message}, market post recomment error.`;
        next(err);
    }

});
