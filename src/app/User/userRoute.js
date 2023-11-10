module.exports = function (app) {
  const user = require("./userController");
  const nemo = require("../Nemo/nemoController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //0. 테스트 API
  // app.get("/app/test", jwtMiddleware, user.getId);

  //1-1. 일반 회원 회원가입 API
  app.post("/signup", user.signUp);

  //1-2. 관리자 회원가입 API
  app.post("/signup/admin", user.signUpAdmin);

  //2. 아이디 중복 확인 API
  app.patch("/app/user/:id", user.checkId);

  //3. 로그인 API
  app.post("/signin", user.signIn);

  //4. 내 정보 조회 API
  app.get("/app/user", jwtMiddleware, user.getUserById);

  //5. 내 정보 수정 API
  app.patch("/app/user", jwtMiddleware, user.editUser);

  // 6. 로그아웃 API
  app.patch("/logout", jwtMiddleware, user.patchLogout);

  // 7. 회원 탈퇴 API
  app.patch("/user/goodbye", jwtMiddleware, user.deleteUser);

  // 8. 인증번호 메일 전송 API
  app.post("/app/mail/send", user.postMailSend);

  // 9. 인증번호 확인 API
  app.post("/app/mail/check", user.postMailCheck);

};
