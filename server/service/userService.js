import cryto from "crypto";

export default class UserService {
  constructor(User) {
    this.User = User;
  }

  signUp = async (email, password, name) => {
    const checkEmail = await this.User.findOne({ email });

    if (checkEmail) {
      throw new Error("이미 가입된 이메일입니다.500");
    }

    let hashPassword = this.passwordHash(password);

    await this.User.create({
      email,
      password: hashPassword,
      name,
    });

    return {
      result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
    };
  };

  passwordHash(password) {
    return cryto.createHash("sha1").update(password).digest("hex");
  }
}
