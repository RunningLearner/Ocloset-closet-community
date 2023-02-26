import userService from "../service/userService";

const passwordHash = (password) => {
  return cryto.createHash("sha1").update(password).digest("hex");
};

export async function signUp(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const result = await userService.signUp(email, password, name);

    res.json(result);
  } catch (err) {
    next(err);
  }
}
