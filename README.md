# O'closet
# IoC 적용해보기

## 1. Awilix
![스크린샷_20230225_091711](https://user-images.githubusercontent.com/97277365/221360017-f8287d71-ec9d-4a85-9b85-d36edad46f0e.png)
- inversify가 가볍고 더 강력한 DI를 제공하지만 Typescript의 데코레이터와 함께 더 시너지를 내기 때문에 Awilix를 사용합니다.
<br />
<br />

## UserService의 회원가입에 적용 해보기
<br />

### 현재코드

```
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
- 라우터에 컨트롤러와 서비스가 섞여있습니다...
- 먼저 최대한 분리를 한다음
- Awilix를 적용하겠습니다.
