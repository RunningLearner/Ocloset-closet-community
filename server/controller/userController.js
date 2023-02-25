import cryto from "crypto";
import User from "../models/user";

const passwordHash = (password) => {
  return cryto.createHash("sha1").update(password).digest("hex");
};

export async function signUp(req, res, next) {
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
      name,
    });

    res.json({
      result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
    });
  } catch (err) {
    next(err);
  }
}
