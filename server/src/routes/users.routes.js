import { Router } from 'express';
import cryto from "crypto";
import {User, Like, Post} from "../models/index.js";
import jwt from "jsonwebtoken";
import jwtConfig from "./../config/jwtConfig.js";
import nodeMailer from "nodemailer";
import authmiddleware from '../util/authmiddleware.js';

export const path = '/users';
export const router = Router();

router.post("/signup", async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
    
        let hashPassword = passwordHash(password);
    
        const checkEmail = await User.findOne({ email });
    
        if (checkEmail) {
            throw new Error("이미 가입된 이메일입니다.500");
        }
    
        await User.create({
            email,
            password: hashPassword,
            name
        });
    
        res.json({
            result: "회원가입이 완료되었습니다. 로그인을 해주세요."
        })
    } catch (err) {
        next(err);
    }

});


router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
    
        let hashPassword = passwordHash(password);
    
        const checkEmail = await User.findOne({ email });
    
        if (!checkEmail) {
            throw new Error("존재하지 않는 이메일입니다.401");
        }
    
        if (hashPassword !== checkEmail.password) {
            throw new Error("비밀번호가 틀렸습니다.401");
        }
        jwt.sign({
            email: email,
            name: checkEmail.name
        }, jwtConfig.secret, {
            expiresIn: '1d' //1y,1d,2h,1m,5s
        }, (err, token) => {
            if (err) {
                res.status(401).json({ status: false, message: "로그인을 해주세요." });
            } else {
                res.json({
                    status: true,
                    accessToken: token,
                    email: email,
                    name: checkEmail.name
                });
            }
        })

    } catch (err) {
        next(err);
    }

})


//비밀번호 찾기 : 2번
router.post("/find/password", async (req, res, next) => {
    try {
        //email값을 가져옵니다.
        let { email } = req.body;
        //email에 해당하는 사용자 정보를 가져옵니다.
        let user = await User.findOne({ email });
        //email을 전송하는데 사용하게 될 email
        let myEmail = "dudspsdl123321@gmail.com";
        //nodemailer를 사용하여 메일전송을합니다.
        let transporter = nodeMailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: myEmail,
                pass: "wsdjonteaayznmkm"
            }
        });
    
        //랜덤 난수값을 가져옵니다.
        const randomPassword = randomPw();
        //랜덤 난수값을 hash형태로 변환합니다.
        const hashRandomPassword = passwordHash(randomPassword);
        //변환된 랜덤 난수 패스워드를 DB에 저장합니다.
        await User.findOneAndUpdate({ shortId: user.shortId }, {
            password: hashRandomPassword,
            status: true    //비밀번호가 변경이 되었다는것을 감지하기 위해 true를 작성
        });
    
        console.log(hashRandomPassword);
    
        //실질적으로 email을 보내는 부분입니다.
        let info = await transporter.sendMail({
            from: `"Elice" <${myEmail}>`,
            to: user.email,
            subject: 'Reset Password By Elice',
            html: `<b>초기화 비밀번호 : ${randomPassword}</b>`
        });
    
        console.log(info.messageId);
    
        //응답처리
        res.json({ result: "이메일을 전송하였습니다." });
    } catch (err) {
        next(err);
    }

});


//랜덤 난수 값을 리턴하는 함수
const randomPw = () => {
    return Math.floor(Math.random() * (10 ** 8)).toString().padStart('0', 8);
}

const passwordHash = (password) => {
    return cryto.createHash("sha1").update(password).digest("hex");
}


// 내가 올린 게시글 목록 불러오기
router.get("/mypost", authmiddleware, async (req, res, next) => {
    try {
        const postType = req.query.postType;
        const email = req.tokenInfo.email;
        const page = Number(req.query.page);
        const perPage = Number(req.query.perPage);

        const userId = await User.findOne({email: email});

        const posts = await Post.find({ postType: postType, show: true, author: userId._id })
            .populate("author")
            .sort({ createdAt: -1 }) //마지막으로 작성된 게시글을 첫번째 인덱스로 가져옴
            .skip(page) //ex> 2페이지라면 5번부터
            .limit(perPage); // 6개씩 가져와줘.
    
        res.status(200).json({ posts });

    } catch(err) {
        err.message = `${err.message}, closet list error.`;
        next(err);
    }

});

// 내가 좋아요 누른 게시글 불러오기
router.get("/mylike", authmiddleware, async (req, res, next) => {
    try {
        const email = req.tokenInfo.email;
        const page = Number(req.query.page);
        const perPage = Number(req.query.perPage);
        
        const userId = await User.findOne({email: email});

        const postsData = await Like.find({userId: userId._id, postId: {$ne: null}})
            .populate("postId")
            .sort({ createdAt: -1 }) //마지막으로 작성된 게시글을 첫번째 인덱스로 가져옴
            .skip(page) //ex> 2페이지라면 5번부터
            .limit(perPage); // 6개씩 가져와줘.
        
        const posts = postsData.reduce((acc, it) => {
                return [ ...acc, it.postId];
        }, []);

        res.json({ posts });
    } catch(err) {
        err.message = `${err.message}, closet list error.`;
        next(err);
    }

});

router.put("/password/change", authmiddleware, async (req, res, next) => {
    try {
        const email = req.tokenInfo.email;
        const { password } = req.body;
    
        let hashPassword = passwordHash(password);
    
        await User.updateOne({ email: email }, { password: hashPassword });
    
        res.json({
            result: " 비밀번호가 변경되었습니다. "
        })
    } catch (err) {
        next(err);
    }

});