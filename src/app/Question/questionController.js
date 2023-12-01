const questionProvider = require("../Question/questionProvider");
const questionService = require("../Question/questionService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

// secret_sms가 ignore파일에 있어서 인증번호 서비스 필요시 연락바람!
// const secret_key = require("../../../config/secret_sms.js");

// 인증번호 사용시 밑에 3가지 install 필요
const axios = require("axios");
const Cache = require("memory-cache");
const CryptoJS = require("crypto-js");

/**
 * API No. 0
 * API Name : 문의글 페이지수 조회 (페이징용)
 * [GET] /question/cnt
 */
exports.getPageCnt = async function (req, res) {
  const department = req.query.department;
  if (department === "default") getPageCntresult = await questionProvider.getPageCnt();
  else getPageCntresult = await questionProvider.getPageCntDep(department);

  res.send(response(baseResponse.SUCCESS, getPageCntresult));
};

/**
 * API No. 1
 * API Name : 문의글 전체 조회
 * [GET] /question
 */
exports.getQuestions = async function (req, res) {
  const department = req.query.department;
  if (department === "default") questionListResult = await questionProvider.retrieveQuestionList();
  else questionListResult = await questionProvider.retrieveQuestionDepList(department);
  return res.send(response(baseResponse.SUCCESS, questionListResult));
};

/**
 * API No. 2
 * API Name : 문의글 작성
 * [POST] /question/writing
 */
exports.postQuestion = async function (req, res) {
  const id = req.verifiedToken.userid;
  // body: title, content
  const { title, content } = req.body;

  if (!title) {
    return res.send(errResponse(baseResponse.POSTQUESTION_TITLE_EMPTY));
  }

  if (!content) {
    return res.send(errResponse(baseResponse.POSTQUESTION_CONTENT_EMPTY));
  }

  if (title.length > 100) {
    return res.send(errResponse(baseResponse.POSTQUESTION_TITLE_LENGTH));
  }
  const postQuestionResponse = await questionService.createQuestion(title, content, id);

  return res.send(response(baseResponse.SUCCESS, postQuestionResponse));
};

/**
 * API No. 3
 * API Name : 문의글 삭제
 * [DELETE] /question/:question_id
 */
exports.deleteQuestion = async function (req, res) {
  const id = req.verifiedToken.userid;
  const questionId = req.params.question_id;
  if (!questionId) return res.send(errResponse(baseResponse.QUESTION_QUESTIONID_EMPTY));

  const admin = await questionProvider.adminCheck(id);
  const roleRows = await questionProvider.questionWriterCheck(questionId);
  const writerCheck = roleRows[0].writer_id;

  if (typeof admin === "undefined" && id !== String(writerCheck)) {
    // db가 writer_id를 int 타입으로 가져와서 String 적용
    return res.send(errResponse(baseResponse.QUESTION_AUTH));
  }

  const deleteQuestionResponse = await questionService.deleteQuestion(questionId, id);
  return res.send(deleteQuestionResponse);
};

/**
 * API No. 4
 * API Name : 문의글 개별 조회
 * [GET] /question/:question_id
 */
exports.getQuestion = async function (req, res) {
  const questionId = req.params.question_id;

  if (!questionId) return res.send(errResponse(baseResponse.QUESTION_QUESTIONID_EMPTY));

  const getQuestionResponse = await questionProvider.retrieveQuestion(questionId);
  return res.send(getQuestionResponse);
};

/**
 * API No. 5
 * API Name : 문의글 답변 작성
 * [POST] /question/:question_id/answer
 */
exports.postAnswer = async function (req, res) {
  const questionId = req.params.question_id;
  const { title, content } = req.body;
  const id = req.verifiedToken.userid;

  // admin 계정인지 확인하는 유효성 검사
  const admin = await questionProvider.adminCheck(id);
  if (typeof admin === "undefined") return res.send(errResponse(baseResponse.ANSWER_NO_ADMIN));

  if (!questionId) return res.send(errResponse(baseResponse.ANSWER_QUESTIONID_EMPTY));
  if (!title) {
    return res.send(errResponse(baseResponse.POSTANSWER_TITLE_EMPTY));
  }
  if (title.length > 100) {
    return res.send(errResponse(baseResponse.POSTANSWER_TITLE_LENGTH));
  }
  if (!content) {
    return res.send(errResponse(baseResponse.POSTANSWER_CONTENT_EMPTY));
  }

  const postAnswerResponse = await questionService.createAnswer(title, content, questionId);

  return res.send(postAnswerResponse);
};

/**
 * API No. 6
 * API Name : 문의글 답변 조회
 * [GET] /question/:question_id/answer
 */
exports.getAnswer = async function (req, res) {
  const questionId = req.params.question_id;

  if (!questionId) return res.send(errResponse(baseResponse.ANSWER_QUESTIONID_EMPTY));

  const getAnswerResponse = await questionProvider.retrieveAnswer(questionId);
  return res.send(getAnswerResponse);
};

/**
 * API No. 7
 * API Name : 문의글 답변 삭제
 * [DELETE] /question/:question_id/answer
 */
exports.deleteAnswer = async function (req, res) {
  // id는 admin 계정 id과 동일한지 유효성 검사 확인
  const id = req.verifiedToken.userid;
  const questionId = req.params.question_id;

  if (!questionId) return res.send(errResponse(baseResponse.ANSWER_QUESTIONID_EMPTY));
  const admin = await questionProvider.adminCheck(id);
  if (typeof admin === "undefined") return res.send(errResponse(baseResponse.ANSWER_NO_ADMIN));

  const deleteAnswerResponse = await questionService.deleteAnswer(questionId, id);
  return res.send(deleteAnswerResponse);
};

/**
 * API No. 8
 * API Name : 문의글 페이징 조회
 * [GET] /question/page/:page
 */
exports.getPageList = async function (req, res) {
  const id = req.verifiedToken.userid;

  const page = req.params.page; // 몇 페이지인지 파라미터로 가져옴
  if (!page) return res.send(errResponse(baseResponse.ANSWER_QUESTIONID_EMPTY));

  const getPageListResponse = await questionProvider.getPageList(page);
  res.send(response(baseResponse.SUCCESS, getPageListResponse));
};

/**
 * API No. 9
 * API Name : 공지글 작성
 * [POST] /notice/write
 */
exports.postNotice = async function (req, res) {
  // admin 계정인지 확인하는 유효성 검사
  const id = req.verifiedToken.userid;
  const admin = await questionProvider.adminCheck(id);
  if (typeof admin === "undefined") return res.send(errResponse(baseResponse.ANSWER_NO_ADMIN));

  const { title, content } = req.body;

  const department = await questionProvider.retrieveDep(id);
  if (!department) return res.send(errResponse(baseResponse.DEPERTMENT_NO_ADMIN));

  if (!title) {
    return res.send(errResponse(baseResponse.POSTANSWER_TITLE_EMPTY));
  }
  if (title.length > 100) {
    return res.send(errResponse(baseResponse.POSTANSWER_TITLE_LENGTH));
  }
  if (!content) {
    return res.send(errResponse(baseResponse.POSTANSWER_CONTENT_EMPTY));
  }

  const postNoticeResponse = await questionService.createNotice(department, title, content);

  return res.send(response(baseResponse.SUCCESS, postNoticeResponse));
};

/**
 * API No. 10
 * API Name : 공지글 전체 조회
 * [GET] /notice
 */
exports.getNotices = async function (req, res) {
  const noticeListResult = await questionProvider.retrieveNoticeList();
  return res.send(response(baseResponse.SUCCESS, noticeListResult));
};

/**
 * API No. 11
 * API Name : 공지글 개별 조회
 * [GET] /notice/:notice_id
 */
exports.getNotice = async function (req, res) {
  const noticeId = req.params.notice_id;

  if (!noticeId) return res.send(errResponse(baseResponse.NOTICE_NOTICEID_EMPTY));

  const getNoticeResponse = await questionProvider.retrieveNotice(noticeId);
  return res.send(getNoticeResponse);
};

/**
 * API No. 12
 * API Name : 공지글 삭제
 * [DELETE] /notice/:notice_id
 */
exports.deleteNotice = async function (req, res) {
  const id = req.verifiedToken.userid;
  const admin = await questionProvider.adminCheck(id);
  if (typeof admin === "undefined") return res.send(errResponse(baseResponse.ANSWER_NO_ADMIN));
  const noticeId = req.params.notice_id;

  if (!noticeId) return res.send(errResponse(baseResponse.NOTICE_NOTICEID_EMPTY));

  const deleteNoticeResponse = await questionService.deleteNotice(noticeId);
  return res.send(deleteNoticeResponse);
};

/**
 * API No. 13
 * API Name : 휴대폰 인증 번호 발송
 * [POST] /notice/send
 */
exports.send = async function (req, res) {
  // admin 계정인지 확인하는 유효성 검사
  const id = req.verifiedToken.userid;
  const admin = await questionProvider.adminCheck(id);
  if (typeof admin === "undefined") return res.send(errResponse(baseResponse.ANSWER_NO_ADMIN));

  // 학과별로 번호 찾는 유효성 검사
  // 학과 가져오기
  const department = await questionProvider.retrieveDep(id);
  // 학과 학생 번호 리스트
  const phoneList = await questionProvider.retrivePhoneList(department);

  var phones = [];
  for (let i = 0; i < phoneList.length; i++) {
    phones.push({ to: `${phoneList[i].phoneNumber}` });
  }

  let date = Date.now().toString();
  const uri = process.env.SMS_NCP_serviceID;
  const secretKey = process.env.SMS_NCP_secretKey;
  const accessKey = process.env.SMS_NCP_accessKEY;
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);

  const smsContent = await questionProvider.retrieveSMS();

  axios({
    method: method,
    json: true,
    url: url,
    headers: {
      "Content-Type": "application/json",
      "x-ncp-iam-access-key": accessKey,
      "x-ncp-apigw-timestamp": date,
      "x-ncp-apigw-signature-v2": signature,
    },
    data: {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: process.env.SMS_MASTER_PHONE,
      content: `${smsContent[0].sms_content}`,
      messages: phones, // admin과 같은 학과인 phoneList
    },
  })
    .then(function (res) {
      return res.send(response(baseResponse.SUCCESS));
    })
    .catch((err) => {
      if (err.res == undefined) {
        return res.send(response(baseResponse.SUCCESS));
      } else return res.send(errResponse(baseResponse.SMS_SEND_FAILURE));
    });
};

/**
 * API No. 14
 * API Name : 문자 보낼 내용 작성
 * [POST] /notice/send/write
 */
exports.postSMS = async function (req, res) {
  const writer_id = req.verifiedToken.userid;

  const admin = await questionProvider.adminCheck(writer_id);
  if (typeof admin === "undefined") return res.send(errResponse(baseResponse.ANSWER_NO_ADMIN));

  const { sms_content } = req.body;

  if (!sms_content) {
    return res.send(errResponse(baseResponse.POSTSMS_CONTENT_EMPTY));
  }

  if (sms_content.length > 100) {
    return res.send(errResponse(baseResponse.POSTSMS_CONTENT_LENGTH));
  }
  const postSMSResponse = await questionService.createSMS(sms_content);

  return res.send(response(postSMSResponse));
};

/**
 * API No. 15
 * API Name : 보낼 문자 조회
 * [GET] /notice/sms
 */
exports.getSMS = async function (req, res) {
  const smsResult = await questionProvider.retrieveSMS();
  return res.send(response(baseResponse.SUCCESS, smsResult));
};

/**
 * API No. 16
 * API Name : 휴대폰 인증 번호 발송
 * [POST] /notice/send
 */
exports.getPhone = async function (req, res) {
  const id = req.verifiedToken.userid;
  const admin = await questionProvider.adminCheck(id);
  if (typeof admin === "undefined") return res.send(errResponse(baseResponse.ANSWER_NO_ADMIN));
  const department = await questionProvider.retrieveDep(id);

  const phoneList = await questionProvider.retrivePhoneList(department);

  var phones = [];
  for (let i = 0; i < phoneList.length; i++) {
    phones.push({ to: `${phoneList[i].phoneNumber}` });
  }

  return res.send(response(baseResponse.SUCCESS, phoneList));
};
