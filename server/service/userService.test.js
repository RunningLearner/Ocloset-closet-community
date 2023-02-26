import { jest, expect, it } from "@jest/globals";
import { User } from "../models";
import UserService from "../service/userService";

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService(User);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("signUp", () => {
    it("should throw an error if the email is already taken", async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: "test@test.com" });

      await expect(
        userService.signUp("test@test.com", "password", "John")
      ).rejects.toThrow("이미 가입된 이메일입니다.500");
    });

    it("should create a new user if the email is available", async () => {
      User.findOne = jest.fn(() => null);
      User.create = jest.fn((email, password, name) => {
        return {
          result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
        };
      });

      const result = await userService.signUp(
        "test@test.com",
        "password",
        "John"
      );

      expect(User.create).toHaveBeenCalledWith({
        email: "test@test.com",
        password: expect.any(String),
        name: "John",
      });
      expect(result).toEqual({
        result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
      });
    });
  });
});
