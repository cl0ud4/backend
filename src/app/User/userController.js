const nodemailer = require("nodemailer");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const userDao = require("../../app/User/userDao");
const nemoProvider = require("../../app/Nemo/nemoProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
//const mailAuth_config = require("../../../config/mailAuth");
//const mailAuth = require("../../../config/mailAuth");

let verifyArr = [];

function generateRandomnumber(studentId) {
  let info = new Object();
  let verifyCode = Math.floor(100000 + Math.random() * 900000) + "";

  info.studentId = Number(studentId);
  info.code = Number(verifyCode);

  verifyArr.push(info);
  return verifyCode;
}

function validatePassword(password) {
  // 대문자, 소문자, 숫자, 특수 문자 포함 여부 확인
  var upperCaseRegex = /[A-Z]/;
  var lowerCaseRegex = /[a-z]/;
  var numberRegex = /[0-9]/;
  var specialCharRegex = /[\W_]/; // \W는 비문자(non-word) 문자, _는 언더스코어를 의미합니다.

  var isUpperCase = upperCaseRegex.test(password);
  var isLowerCase = lowerCaseRegex.test(password);
  var hasNumber = numberRegex.test(password);
  var hasSpecialChar = specialCharRegex.test(password);

  // 길이 확인
  var isValidLength = password.length >= 8 && password.length <= 30;

  // 결과 반환
  return isUpperCase && isLowerCase && hasNumber && hasSpecialChar && isValidLength;
}

/**
 * API No. 1
 * API Name : 회원 가입 API
 * [POST] /signup
 */
exports.signUp = async function (req, res) {
  const { id, password, phoneNumber, department, permission } = req.body;

  // 사물함이 없는 경우 회원가입 불가
  const lockersInfoResult = await nemoProvider.retrieveLockersInfo(department);
  if (studentId !== id) {
    return res.send(errResponse(baseResponse.CHECK_VALID_USER));
  }
  if (typeof lockersInfoResult[0] === "undefined") {
    return res.send(response(baseResponse.SIGNUP_LOCKER_NOT_EXIST));
  } else {
    const signUpResponse = await userService.createUser(id, password, phoneNumber, department, permission);

    return res.send(response(baseResponse.SUCCESS, signUpResponse));
  }
};

/**
 * API No. 1 - 2
 * API Name : 관리자 회원 가입 API
 * [POST] /signup/admin
 */

exports.signUpAdmin = async function (req, res) {
  const { id, password, department, permission } = req.body;
  // 같은 학과의 관리자가 이미 존재하는 경우 회원가입 불가
  const signUpResponse = await userService.createAdmin(id, password, department, permission);
  return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 아이디 중복 확인 API
 * [patch] /app/user/:id
 **/
exports.checkId = async function (req, res) {
  const id = req.params.id;
  const id_result = await userProvider.checkRepeatId(id);

  if (id_result < 1) {
    return res.send(response(baseResponse.SUCCESS, id_result));
  } else {
    return res.send(response(baseResponse.SIGNUP_REDUNDANT_ID, id_result));
  }
};

/**
 * API No. 3
 * API Name : 로그인 API
 * [POST] /signin
 **/

exports.signIn = async function (req, res) {
  const { id, password } = req.body;
  

  const userLogin = await userService.userSignIn(id, password);
  const adminLogin = await userService.adminSignIn(id, password);

  if (userLogin === 0 && adminLogin === 0) return res.send(errResponse(baseResponse.USER_DO_NOT_EXSIT));
  else if (adminLogin.isSuccess === false || adminLogin) return res.send(adminLogin);
  else if (!userLogin.isSuccess === false || userLogin) return res.send(userLogin);
};

/**
 * API No. 4
 * API Name : 내 정보 조회 API
 * [POST] /app/user
 */
exports.getUserById = async function (req, res) {
  try {
    // 요청에서 필요한 정보 추출
    const userId = req.verifiedToken.userid;

    // 사용자 검색
    const user = await userProvider.checkUserId(userId);
    const admin = await userProvider.checkAdminId(userId);

    if (Object.keys(user).length) {
      return res.send(response(baseResponse.SUCCESS, user[0]));
    } else if (Object.keys(admin).length) {
      return res.send(response(baseResponse.SUCCESS, admin[0]));
    } else {
      return res.send(errResponse(baseResponse.USER_FIND_FAIL));
    }
  } catch (error) {
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 5
 * API Name : 내 정보 수정 API
 * [PATCH] app/user
 */

exports.editUser = async function (req, res) {
  try {
    const userId = req.verifiedToken.userid;
    const { phoneNumber } = req.body;

    // 사용자 정보 수정
    const user = await userService.editUser(userId, phoneNumber);

    // 응답
    return res.send(response(baseResponse.SUCCESS));
  } catch (error) {
    // 오류 처리
    return res.send(errResponse(baseResponse.USER_EDIT_FAIL));
  }
};

/**
 * API No. 6
 * API Name : 로그아웃 API
 * [PATCH] /logout
 */

exports.patchLogout = async function (req, res) {
  try {
    // 요청에서 필요한 정보 추출
    const userId = req.verifiedToken.userid;

    // 사용자 검색
    const user = await userProvider.checkUserId(userId);

    // 사용자가 없으면 오류 응답
    if (!user) {
      return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }
    // 응답
    return res.send(response(baseResponse.SUCCESS));
  } catch (error) {
    // 오류 처리
    return res.send(errResponse(baseResponse.USER_LOGOUT_FAIL));
  }
};

/**
 * API No. 7
 * API Name : 회원 탈퇴 API
 * [patch] /user/goodbye
 */

exports.deleteUser = async function (req, res) {
  try {
    // 요청에서 필요한 정보 추출
    const userId = req.verifiedToken.userid;

    // 사용자 검색
    const user = await userProvider.checkUserId(userId);

    // 사용자가 없으면 오류 응답
    if (!user) {
      return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    } else if (user[0].permission === 1) {
      // 관리자의 경우 탈퇴 불가
      return res.send(errResponse(baseResponse.USER_ADMIN_NOT_DELETE));
    } else {
      // 사용자 삭제
      await userService.deleteUser(userId);
      // 응답
      return res.send(response(baseResponse.SUCCESS));
    }
  } catch (error) {
    // 오류 처리
    return res.send(errResponse(baseResponse.USER_DELETE_FAIL));
  }
};

/**
 * API No. 8
 * API Name : 메일인증 API
 * [POST] /app/mail/send
 */
exports.postMailSend = async function (req, res) {
  studentId = req.body.studentId;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const authenticationNumber = generateRandomnumber(studentId);
  console.log(verifyArr);
  let mailText = `[네모의 꿈] 회원가입 인증번호가 발송되었습니다 <br/><h1>${authenticationNumber}</h1>`;
  await transporter
    .sendMail({
      from: process.env.MAIL_USER,
      to: studentId + "@sungshin.ac.kr",
      subject: "네모의 꿈 회원가입 인증번호",
      html: mailText,
    })
    .then(() => {
      transporter.close();
      return res.send(response(baseResponse.SUCCESS));
    })
    .catch((error) => {
      console.log(error);
      return res.send(errResponse(baseResponse.SEND_MAIL_FAILED));
    });
};

/**
 * API No. 9
 * API Name : 인증번호 확인 API
 * [POST] /app/mail/check
 */
exports.postMailCheck = async function (req, res) {
  const getStudentId = Number(req.body.studentId);
  const mailAuthenticationNumber = Number(req.body.mailAuthenticationNumber);

  let info = verifyArr.find((arr) => arr.studentId === getStudentId);

  if (getStudentId !== info.studentId || mailAuthenticationNumber !== info.code) {
    return res.send(errResponse(baseResponse.CHECK_MAIL_FAILED));
  } else {
    // 기존에 저장한 자료구조 제거
    verifyArr = verifyArr.filter((param) => param.studentId != getStudentId);
    return res.send(response(baseResponse.SUCCESS));
  }
};


