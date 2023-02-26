import userController from "./userController";

test("adds 1 + 2 to equal 3", () => {
  //given
  const data = {
    body: { email: "test@test.com", password: "1234", name: "test" },
  };
  //when
  userController.signUp(data);
  //then
  expect(userController.signUp(1, 2)).toBe(3);
});
