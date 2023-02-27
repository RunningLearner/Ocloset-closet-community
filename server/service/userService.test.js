import { jest, expect, it } from "@jest/globals";
import UserService from "../service/userService";

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService({
      user: { findOne: jest.fn(), create: jest.fn() },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("signUp", () => {
    it("should throw an error if the email is already taken", async () => {
      userService.user.findOne.mockReturnValueOnce({
        email: "test@test.com",
      });

      await expect(
        userService.signUp("test@test.com", "password", "John")
      ).rejects.toThrow("이미 가입된 이메일입니다.500");
      expect(userService.user.findOne).toBeCalled();
      expect(userService.user.create).not.toBeCalled();
    });

    it("should create a new user if the email is available", async () => {
      userService.user.findOne = jest.fn(() => null);
      userService.user.create = jest.fn((email, password, name) => {
        return {
          result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
        };
      });

      const result = await userService.signUp(
        "test@test.com",
        "password",
        "John"
      );

      expect(userService.user.create).toHaveBeenCalledWith({
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
