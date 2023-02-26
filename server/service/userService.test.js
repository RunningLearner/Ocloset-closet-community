// userService.test.js
import signUp from "./userService.js";
import { jest, expect, it } from "@jest/globals";
import { User } from "../models/index.js";

describe("signUp function", () => {
  const email = "test@example.com";
  const password = "password";
  const name = "Test User";

  it("should create a new user when email is not taken", async () => {
    User.findOne = jest.fn(() => null);
    User.create = jest.fn((email, password, name) => {
      return {
        result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
      };
    });
    const result = await signUp(email, password, name);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(User.create).toHaveBeenCalledWith({
      email,
      password: expect.any(String),
      name,
    });
    expect(result).toEqual({
      result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
    });
  });

  it("should throw an error when email is already taken", async () => {
    //when
    User.findOne = jest.fn((email) => "무언가 찾아진 값");
    User.create = jest.fn((email, password, name) => {
      return {
        result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
      };
    });

    //then
    await expect(signUp(email, password, name)).rejects.toThrow(
      new Error("이미 가입된 이메일입니다.500")
    );
    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(User.create).not.toHaveBeenCalled();
  });
});
