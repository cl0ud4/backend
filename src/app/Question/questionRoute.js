module.exports = function (app) {
  const question = require("./questionController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 0. 페이지 수 확인
  app.get("/question/cnt", question.getPageCnt);

  // 1. 문의글 전체 조회
  app.get("/question", question.getQuestions);

  // 2. 문의글 작성
  app.post("/question/writing", jwtMiddleware, question.postQuestion);

  // 3. 문의글 삭제
  app.delete("/question/:question_id", jwtMiddleware, question.deleteQuestion);

  // 4. 문의글 개별 조회
  app.get("/question/:question_id", question.getQuestion);

  // 5. 문의글 답변 작성
  app.post("/question/:question_id/answer", jwtMiddleware, question.postAnswer);

  // 6. 문의글 답변 조회
  app.get("/question/:question_id/answer", question.getAnswer);

  // 7. 문의글 답변 삭제
  app.delete("/question/:question_id/answer", jwtMiddleware, question.deleteAnswer);

  // 8. 문의글 페이징
  app.get("/question/page/:page", jwtMiddleware, question.getPageList);

  // 9. 공지 작성
  app.post("/notice/write", jwtMiddleware, question.postNotice);

  // 10. 공지 전체 조회
  app.get("/notice", question.getNotices);

  // 11. 공지 개별 조회
  app.get("/notice/:notice_id", question.getNotice);

  // 12. 공지 삭제 (내리기)
  app.delete("/notice/:notice_id", jwtMiddleware, question.deleteNotice);

  // 13. 문자(SENS를 통한) 전송 API
  app.post("/notice/send", jwtMiddleware, question.send);

  // 14. 문자 보낼 내용 작성
  app.post("/notice/send/write", jwtMiddleware, question.postSMS);

  // 15. 보낼 문자 조회
  app.get("/notice/sms", jwtMiddleware, question.getSMS);

  // 16. 학과 학생 핸드폰 리스트 조회
  app.get("/phonelist", jwtMiddleware, question.getPhone);
};
