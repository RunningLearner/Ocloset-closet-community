# O'closet
## start server
- git clone 후에 
- docker-compose up 사용
<br />

# IoC 적용해보기

## 1. Awilix
![스크린샷_20230225_091711](https://user-images.githubusercontent.com/97277365/221360017-f8287d71-ec9d-4a85-9b85-d36edad46f0e.png)
- inversify가 가볍고 더 강력한 DI를 제공하지만 Typescript의 데코레이터와 함께 더 시너지를 내기 때문에
- javascript와 함께 자주 쓰이는 Awilix를 사용합니다.
<br />
<br />

## 2. 기존의 코드에 OOP를 적용하기 위해 리펙토링
<br />

### 분리 전

```javascript
...

router.post("/signup", async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
    
        let hashPassword = passwordHash(password);
    
        const checkEmail = await User.findOne({ email });
    
        if (checkEmail) {
            throw new Error("이미 가입된 이메일입니다.500");
        }
    
        await User.create({
            email,
            password: hashPassword,
            name
        });
    
        res.json({
            result: "회원가입이 완료되었습니다. 로그인을 해주세요."
        })
    } catch (err) {
        next(err);
    }
});
```
- 라우터에 컨트롤러와 서비스가 섞여있었습니다...
- 먼저 최대한 분리를 한다음
- Awilix를 적용하겠습니다.
<br />

### 분리 후
```javascript
//userController.js
import userService from "../service/userService.js";

export default async function signUp(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const result = await userService(email, password, name);

    res.json(result);
  } catch (err) {
    next(err);
  }
}
```
```javascript
//userService.js
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
```
- 컨트롤러에서 비즈니스 로직을 분리하여 서비스를 만들었습니다.
- jest를 통해서 service 유닛테스트를 검증하였습니다.
- 이제는 DI를 통해 IoC를 적용하기 위해 클래스화가 필요합니다.
<br />

## 3. 리펙토링한 코드에 OOP 적용
```javascript
//router.js
...
import { User } from "../models/index.js";

const userService = new UserService(User);
const userController = new UserController(userService);
router.post("/signup", userController.signUp.bind(userController));
...
```
```javascript
//userController.js
export default class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async signUp(req, res, next) {
    try {
      const { email, password, name } = req.body;

      const result = await this.userService.signUp(email, password, name);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
```
```javascript
//userService.js
import cryto from "crypto";

export default class UserService {
  constructor(User) {
    this.User = User;
  }

  async signUp(email, password, name) {
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
  }

  passwordHash(password) {
    return cryto.createHash("sha1").update(password).digest("hex");
  }
}
```
- 변경에 맞게 userService.test도 수정하였습니다.
- DI를 통해서 컨트롤러와 서비스간의 직접적인 의존성을 제거하였습니다.

<br />

## 4. Awilix를 통해서 IoC 구현
```javascript
//routes.js
...
import { setup, container } from "../di.config.js";
setup();

// const userService = new UserService(User);
// const userController = new UserController(userService); 기존에 있던 코드를 컨테이너로 대체 
const userController = container.resolve("userController");
router.post("/signup", userController.signUp);
```
```javascript
//userController.js
export default class UserController {
  constructor({ userService }) {
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
```
```javascript
//userService.js
import cryto from "crypto";

export default class UserService {
  constructor({ user }) {
    this.user = user;
  }

  signUp = async (email, password, name) => {
    const checkEmail = await this.user.findOne({ email });

    if (checkEmail) {
      throw new Error("이미 가입된 이메일입니다.500");
    }

    let hashPassword = this.passwordHash(password);

    await this.user.create({
      email,
      password: hashPassword,
      name,
    });

    return {
      result: "회원가입이 완료되었습니다. 로그인을 해주세요.",
    };
  };

  passwordHash = (password) => {
    return cryto.createHash("sha1").update(password).digest("hex");
  };
}
```
```javascript
//userService.test.js
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
```
- 최종 완성 코드입입니다.
- 레거시 코드 -> SRP 적용 (로직 분리) -> FP에서 OOP로 전환 -> DI적용 -> DI를 Awilix를 통해 자동화 하여 IoC적용
- 중간중간 테스트 코드를 수정하였었는데, 확실히 DI를 적용한 후 의존성이 낮아지니 test를 하기 수월하였습니다.
