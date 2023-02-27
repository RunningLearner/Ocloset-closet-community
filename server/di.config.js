import awilix from "awilix";
import UserController from "./controller/userController.js";
import { User } from "./models/index.js";
import UserService from "./service/userService.js";

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
  container.register({
    userController: awilix.asClass(UserController),
    userService: awilix.asClass(UserService),
    user: awilix.asValue(User),
  });
}

export { container, setup };
