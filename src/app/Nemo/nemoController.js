const nemoProvider = require("../../app/Nemo/nemoProvider");
const userProvider = require("../../app/User/userProvider");
const nemoService = require("../../app/Nemo/nemoService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const deprecate = require("util-deprecate");

/**
 * API No. 0
 * API Name : 0. 테스트 API
 * [GET] /nemo/test ✅
 */
exports.getTest = async function (req, res) {
  // user 전체 정보 return
  const { pool } = require("../../../config/database");
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfo = `
    SELECT *
    FROM admin
    WHERE id = "sswu-com";
  `;
  const [selectUserInfoResult] = await connection.query(selectUserInfo);
  connection.release();

  return res.send(response(baseResponse.SUCCESS, selectUserInfoResult[0]));
};

/**
 * API No. 1
 * API Name : 1. 학과 내 모든 사물함 전체 조회 API
 * [GET] /nemo/lockers ✅
 */
exports.getLockers = async function (req, res) {
  /**
   * Query String: department
   */
  const department = req.query.department;

  if (department) {
    // 사물함 전체 조회
    const lockerListResult = await nemoProvider.retrieveLockerList(department);
    if (lockerListResult.length) return res.send(response(baseResponse.SUCCESS, lockerListResult));
    else return res.send(errResponse(baseResponse.LOCKER_NOT_EXIST));
  } else {
    console.error(`NemoController - getLockers error: ${error}`);
    return res.send(errResponse(baseResponse.LOCKER_SEARCH_FAILED));
  }
};

/**
 * API No. 2
 * API Name : 과사물함 전체 삭제 API
 * [DELETE] /nemo/lockers ✅
 */
exports.deleteLockers = async function (req, res) {
  try {
    let adminId = req.verifiedToken.userid;
    let getAdmin = await userProvider.checkAdminId(adminId);
    getAdmin = getAdmin[0];
    if (typeof getAdmin === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    // 권한확인
    if (!getAdmin.permission) {
      return res.send(errResponse(baseResponse.NOT_ADMIN));
    }
    // 삭제수행
    const deleteLockersResult = await nemoService.deleteLockers(getAdmin.department);

    if (typeof deleteLockersResult === undefined || deleteLockersResult.isSuccess === false) {
      return res.send(errResponse(baseResponse.LOCKER_DELETE_FAILED));
    }
    return res.send(response(baseResponse.SUCCESS));
  } catch (error) {
    console.error(`NemoController - deleteLockers error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 3
 * API Name : 과사물함 정보 기입 API
 * [POST] /nemo/lockers-info ✅
 */
exports.postLockersInfo = async function (req, res) {
  /**
   * Body: location, deposit, row, col, order
   */
  try {
    let adminId = req.verifiedToken.userid;
    let getAdmin = await userProvider.checkAdminId(adminId);
    getAdmin = getAdmin[0];

    if (typeof getAdmin === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    // 권한확인
    if (!getAdmin.permission) {
      return res.send(errResponse(baseResponse.NOT_ADMIN));
    }
    // 과사물함 DB 생성
    const { location, deposit, row, col, order } = req.body;
    const lockersResponse = await nemoService.createLockers(getAdmin.department, location, deposit, row, col, order);
    return res.send(response(baseResponse.SUCCESS, lockersResponse));
  } catch (error) {
    console.error(`NemoController - postLockersInfo error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 4
 * API Name : 과사물함 정보 조회 API
 * [GET] /nemo/lockers-info ✅
 */
exports.getLockersInfo = async function (req, res) {
  /**
   * Query String: department
   */
  const department = req.query.department;
  if (department) {
    // 과사물함 정보 조회
    const lockersInfoResult = await nemoProvider.retrieveLockersInfo(department);

    if (typeof lockersInfoResult === "undefined" || Object.keys(lockersInfoResult).length === 0) {
      return res.send(errResponse(baseResponse.LOCKER_SEARCH_FAILED));
    }

    return res.send(response(baseResponse.SUCCESS, lockersInfoResult[0]));
  } else {
    console.error(`NemoController - getLockersInfo error: ${error}`);
    return res.send(errResponse(baseResponse.USER_DEPARTMENT_NOT_EXIST));
  }
};

/**
 * API No. 5
 * API Name : 사물함정보 변경 API
 * [PATCH] /nemo/lockers-info ✅
 */
exports.patchLockersInfo = async function (req, res) {
  try {
    const { location, deposit } = req.body;
    let adminId = req.verifiedToken.userid;
    let getAdmin = await userProvider.checkAdminId(adminId);
    getAdmin = getAdmin[0];
    if (typeof getAdmin === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    // 권한확인
    if (!getAdmin.permission) {
      return res.send(errResponse(baseResponse.NOT_ADMIN));
    }
    const lockersInfoResponse = await nemoService.editLockersInfo(getAdmin.department, location, deposit);

    return res.send(response(baseResponse.SUCCESS, lockersInfoResponse));
  } catch (error) {
    console.error(`NemoController - patchLockersInfo error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 6
 * API Name : 사물함 번호 기입 API
 * [POST] /nemo/lockers-info/number ✅
 */
exports.postLockersNumber = async function (req, res) {
  try {
    let adminId = req.verifiedToken.userid;
    let getAdmin = await userProvider.checkAdminId(adminId);
    getAdmin = getAdmin[0];
    if (typeof getAdmin === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    // 권한확인
    if (!getAdmin.permission) {
      return res.send(errResponse(baseResponse.NOT_ADMIN));
    }
    const lockerIds = req.body.lockerIds;

    if (!getAdmin.department) {
      return res.send(errResponse(baseResponse.USER_DEPARTMENT_NOT_EXIST));
    }

    const lockerResponse = await nemoService.createLocker(getAdmin.department, lockerIds);
    if (lockerResponse.isSuccess === false) {
      return res.send(errResponse(baseResponse.LOCKER_NUMBERING_FALIED));
    }

    return res.send(response(baseResponse.SUCCESS));
  } catch (error) {
    console.error(`NemoController - postLockersNumber error ${error}`);
    return res.send(errResponse(baseResponse.LOCKER_NUMBERING_FALIED));
  }
};

/**
 * API No. 7
 * API Name : 사물함(하나) 정보 변경 API
 * [PATCH] /nemo/locker/:lockerId ✅
 */
exports.patchLockerById = async function (req, res) {
  try {
    let adminId = req.verifiedToken.userid;
    let getAdmin = await userProvider.checkAdminId(adminId);
    getAdmin = getAdmin[0];
    if (typeof getAdmin === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    // 권한확인
    if (!getAdmin.permission) {
      return res.send(errResponse(baseResponse.NOT_ADMIN));
    }
    if (!req.body.status) {
      return res.send(errResponse(baseResponse.LOCKER_STATUS_EMPTY));
    }
    let { userId, note, status } = req.body;
    const lockerId = req.params.lockerId;
    if ((userId === "20190000" && status === "other") || status === "empty") {
      await nemoService.updateLocker(getAdmin.department, lockerId, status, note, null);
      return res.send(response(baseResponse.SUCCESS));
    }
    // 정보변경 체크사항 1. 유저가 해당 학과인지
    let getUser = await userProvider.checkUserId(userId);
    getUser = getUser[0];
    // 회원이 존재하는지
    if (typeof getUser === "undefined") {
      return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }
    // admin과 같은 학과인지
    if (getAdmin.department !== getUser.department) {
      return res.send(errResponse(baseResponse.LOCKER_DEPARTMENT_NOT_CORRECT));
    }
    // 정보변경 체크사항 2. 사물함 상태를 바꾸고 싶으면 해당 학생이 점유한 사물함인지 확인해야함
    let getLocker = await nemoProvider.lockerRentCheck(getAdmin.department, userId);

    if (getLocker && getLocker[0].fk_user_id !== getUser.id) {
      return res.send(errResponse(baseResponse.USER_NOT_OWNER));
    }
    if (status === "other" || status === "emtpy") {
      userId = null;
    }
    const lockerResponse = await nemoService.updateLocker(getAdmin.department, lockerId, status, note, userId);
    if (lockerResponse.isSuccess === false) {
      return res.send(errResponse(baseResponse.LOCKER_INFO_CHANGE_FAILED));
    }

    return res.send(response(baseResponse.SUCCESS, lockerResponse[0]));
  } catch (error) {
    console.error(`NemoController - patchLockerById error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 8
 * API Name : 사물함 대여 요청 API
 * [POST] /nemo/locker/rent/:lockerId  ✅
 */
exports.postRentLockerById = async function (req, res) {
  // 요청 DB에 쌓여야 함
  try {
    let userId = req.verifiedToken.userid;
    let getUser = await userProvider.checkUserId(userId);
    getUser = getUser[0];
    if (typeof getUser === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    const lockerId = req.params.lockerId;

    const LockerRequestResponse = await nemoService.createLockerRequest(getUser.department, userId, lockerId, "request", "");
    if (LockerRequestResponse.isSuccess === false) {
      return res.send(errResponse(baseResponse.RENT_REQUEST_FAILED));
    }

    return res.send(response(baseResponse.SUCCESS, LockerRequestResponse[0]));
  } catch (error) {
    console.error(`NemoController - postRentLockerById error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 9
 * API Name : 사물함 대여취소 요청 API
 * [POST] /nemo/locker/cancel/:lockerId ✅
 */
exports.postCancelLockerById = async function (req, res) {
  try {
    let userId = req.verifiedToken.userid;
    let getUser = await userProvider.checkUserId(userId);
    getUser = getUser[0];
    if (typeof getUser === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    const lockerId = req.params.lockerId;

    const reqResponse = await nemoService.deleteLockerRequest(getUser.department, userId, lockerId, "empty", "");
    if (reqResponse.isSuccess === false) {
      return res.send(errResponse(baseResponse.CANCEL_REQUEST_FAILED));
    }

    return res.send(response(baseResponse.SUCCESS, reqResponse[0]));
  } catch (error) {
    console.error(`NemoController - postCancelLockerById error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 10
 * API Name : 사물함 반납 요청 API
 * [POST] /nemo/locker/return/:lockerId  ✅
 */
exports.postReturnLockerById = async function (req, res) {
  try {
    let userId = req.verifiedToken.userid;
    let getUser = await userProvider.checkUserId(userId);
    getUser = getUser[0];
    if (typeof getUser === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    const lockerId = req.params.lockerId;
    const LockerRequestResponse = await nemoService.createLockerRequest(getUser.department, userId, lockerId, "return", "");
    if (LockerRequestResponse.isSuccess === false) {
      return res.send(errResponse(baseResponse.RETURN_REQUEST_FAILED));
    }

    return res.send(response(baseResponse.SUCCESS, LockerRequestResponse[0]));
  } catch (error) {
    console.error(`NemoController - postReturnLockerById error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 11
 * API Name : 사물함 반납 취소 요청 API
 * [POST] /nemo/locker/cancel-return/:lockerId ✅
 */
exports.postCancelReturnLockerById = async function (req, res) {
  try {
    let userId = req.verifiedToken.userid;
    let getUser = await userProvider.checkUserId(userId);
    getUser = getUser[0];
    if (!getUser) {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const lockerId = req.params.lockerId;

    const reqResponse = await nemoService.deleteLockerRequest(getUser.department, userId, lockerId, "using", "");
    if (reqResponse.isSuccess === false) {
      return res.send(errResponse(baseResponse.CANCEL_RETURN_REQUEST_FAILED));
    }
    return res.send(response(baseResponse.SUCCESS, reqResponse[0]));
  } catch (error) {
    console.error(`NemoController - postCancelReturnLockerById error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};

/**
 * API No. 12
 * API Name : 사용자가 대여한 사물함 조회 API
 * [GET] /nemo/check ✅
 */
exports.getCheck = async function (req, res) {
  try {
    let userId = req.verifiedToken.userid;
    let getUser = await userProvider.checkUserId(userId);

    getUser = getUser[0];
    if (typeof getUser === "undefined") {
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const reqResponse = await nemoProvider.lockerRentCheck(getUser.department, userId);

    if (reqResponse === null) return res.send(errResponse(baseResponse.USER_NOT_RENT_LOCKER));
    return res.send(response(baseResponse.SUCCESS, reqResponse[0]));
  } catch (error) {
    console.error(`NemoController - getCheck error: ${error}`);
    return res.send(errResponse(baseResponse.SERVER_ERROR));
  }
};
