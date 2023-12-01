const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
//const secret_config = require("../../../config/secret");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.createUser = async function (id, password, phoneNumber, department, permission) {
  try {
    const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");
    const connection = await pool.getConnection(async (conn) => conn);

    await userDao.creatUser(connection, id, hashedPassword, phoneNumber, department, permission);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 관리자 회원가입
exports.createAdmin = async function (id, password, department, permission) {
  try {
    // 비밀번호 확인
    const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");
    const connection = await pool.getConnection(async (conn) => conn);
    const p = [id, hashedPassword, department, permission];
    const adminIdResult = await userDao.createAdmin(connection, p);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createAdmin Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.userSignIn = async function (userid, password) {
  try {
    const selectUserPasswordParams = [userid, password];
    const userCheck = await userProvider.userCheck(userid); // 유저 확인

    if (userCheck < 1) return 0;
    const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

    // 비밀번호 확인
    const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");

    if (!passwordRows || passwordRows !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // JWT 생성
    const token = await jwt.sign(
      {
        userid: userid,
      }, // 토큰의 내용(payload)
      process.env.JWT_SECRET, // 비밀 키
      {
        expiresIn: "365d",
        subject: "userid",
      } // 유효 기간 365일
    );
    return response(baseResponse.SUCCESS, { jwt: token });
  } catch (err) {
    logger.error(`App - SignIn Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.adminSignIn = async function (userid, password) {
  try {
    const selectUserPasswordParams = [userid, password];
    const userCheck = await userProvider.adminCheck(userid); // 유저 확인

    const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");

    if (userCheck < 1) return 0;
    if (userCheck[0].state === "0") return 0;
    const passwordRows = await userProvider.passwordAdminCheck(selectUserPasswordParams);

    if (!passwordRows || passwordRows !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }
    // JWT 생성
    const token = await jwt.sign(
      {
        userid: userid,
      }, // 토큰의 내용(payload)
      process.env.JWT_SECRET, // 비밀 키
      {
        expiresIn: "365d",
        subject: "userid",
      } // 유효 기간 365일
    );
    return response(baseResponse.SUCCESS, { jwt: token });
  } catch (err) {
    logger.error(`App - SignIn Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 로그인 인증 방법
exports.signIn = async function (userid, password) {
  try {
    const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");

    const selectUserPasswordParams = [userid, password];
    const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

    if (!passwordRows || passwordRows !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // JWT 생성
    const token = await jwt.sign(
      {
        userid: userid,
      }, // 토큰의 내용(payload)
 	process.env.JWT_SECRET, // 비밀 키
      {
        expiresIn: "365d",
        subject: "userid",
      } // 유효 기간 365일
    );
    const user = await userProvider.checkUserId(userid);
    const admin = await userProvider.checkAdminId(userid);
    if (Object.keys(user).length) {
      // user
      return response(baseResponse.SUCCESS, { jwt: token, permission: user[0].permission });
    } else if (Object.keys(admin).length) {
      // admin
      return response(baseResponse.SUCCESS, { jwt: token, permission: admin[0].permission });
    } else {
      return errResponse(baseResponse.DB_ERROR);
    }
  } catch (err) {
    logger.error(`App - SignIn Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editUser = async function (id, phoneNumber) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    await userDao.updateUserById(connection, id, phoneNumber);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.deleteUser = async function (id) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    await userDao.deleteUser(connection, id);

    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - deleteUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
