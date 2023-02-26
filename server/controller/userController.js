import userService from "../service/userService.js";

const passwordHash = (password) => {
  return cryto.createHash("sha1").update(password).digest("hex");
};

export default async function signUp(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const result = await userService.signUp(email, password, name);

    res.json(result);
  } catch (err) {
    next(err);
  }
}
