import cryto from "crypto";
import { User } from "../models/index.js";

const passwordHash = (password) => {
  return cryto.createHash("sha1").update(password).digest("hex");
};

export default async function signUp(email, password, name) {
  const checkEmail = await User.findOne({ email });

  if (checkEmail) {
    throw new Error("이미 가입된 이메일입니다.500");
  }

  let hashPassword = passwordHash(password);

  await User.create({
    email,
    password: hashPassword,
    name,
  });
  return {
    result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
  };
}
