module.exports = function (app) {
  const nemo = require("./nemoController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  // 0. 테스트 API
  app.get("/nemo/test", nemo.getTest);

  // 1. 학과 내 모든 사물함 전체 조회 API
  app.get("/nemo/lockers", nemo.getLockers);

  // 2. 과사물함 전체 삭제
  app.delete("/nemo/lockers", jwtMiddleware, nemo.deleteLockers);

  // 3. 과사물함 정보 기입 API
  app.post("/nemo/lockers-info", jwtMiddleware, nemo.postLockersInfo);

  // 4. 과사물함 정보 조회 API
  app.get("/nemo/lockers-info", nemo.getLockersInfo);

  // 5. 사물함정보 변경 API
  app.patch("/nemo/lockers-info", jwtMiddleware, nemo.patchLockersInfo);

  // 6. 사물함 번호 기입 API
  app.post("/nemo/lockers-info/number", jwtMiddleware, nemo.postLockersNumber);

  // 7. 사물함(하나) 정보 변경 API
  app.patch("/nemo/locker/:lockerId", jwtMiddleware, nemo.patchLockerById);

  // 8. 사물함 대여 요청 API
  app.post("/nemo/locker/rent/:lockerId", jwtMiddleware, nemo.postRentLockerById);

  // 9. 사물함 대여취소 요청 API
  app.post("/nemo/locker/cancel/:lockerId", jwtMiddleware, nemo.postCancelLockerById);

  // 10. 사물함 반납 요청 API
  app.post("/nemo/locker/return/:lockerId", jwtMiddleware, nemo.postReturnLockerById);

  // 11. 사물함 반납 취소 요청 API
  app.post("/nemo/locker/cancel-return/:lockerId", jwtMiddleware, nemo.postCancelReturnLockerById);

  // 12. 사용자가 대여한 사물함 조회 API
  app.get("/nemo/check", jwtMiddleware, nemo.getCheck);
};
