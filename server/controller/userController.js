export default class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  signUp = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      const result = await this.userService.signUp(email, password, name);

      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
