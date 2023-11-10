const { pool } = require("../../../config/database");
const nemoProvider = require("./nemoProvider");
const nemoDao = require("./nemoDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

// 사물함 전체 삭제
exports.deleteLockers = async function (department) {
  try {
    // 삭제할 사물함이 존재하는지 확인
    const existCheck = await nemoProvider.retrieveLockerList(department);
    if (existCheck.length === 0) {
      return errResponse(baseResponse.LOCKER_NOT_EXIST);
    }
    // 모든 사물함이 비었는지 확인
    const emptyCheck = await nemoProvider.emptyCheck(department);
    if (emptyCheck === false) {
      return errResponse(baseResponse.LOCKER_NON_EMPTY);
    }
    // 사물함 삭제
    const connection = await pool.getConnection(async (conn) => conn);

    await nemoDao.deleteLockers(connection, department);

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (error) {
    console.error(`nemoService - deleteLockers error: ${error}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 사물함 생성
exports.createLockers = async function (department, location, deposit, row, col, order) {
  try {
    // 사물함정보 중복 확인
    const lockerInfo = await nemoProvider.lockerInfoCheck(department);
    if (lockerInfo.length !== 0) return errResponse(baseResponse.LOCKER_ALREADY_EXISTS);
    // 사물함 개수 확인
    if (row < 1 || col < 1) return errResponse(baseResponse.LOCKER_STATUS_EMPTY);

    const insertLockersInfoParams = [department, location, deposit, row, col, order];

    const connection = await pool.getConnection(async (conn) => conn);

    await nemoDao.insertLockersInfo(connection, insertLockersInfoParams);

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (error) {
    console.error(`nemoService - createLockers error: ${error}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 사물함정보 변경
exports.editLockersInfo = async function (department, location, deposit) {
  try {
    const editLockersInfoParams = [location, deposit, department];

    const connection = await pool.getConnection(async (conn) => conn);
    await nemoDao.updateLockersInfo(connection, editLockersInfoParams);
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (error) {
    console.error(`nemoService - editLockersInfo error: ${error}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 사물함 번호 기입(사물함 생성)
exports.createLocker = async function (department, lockerIds) {
  try {
    // 반복문으로 사물함 생성
    const connection = await pool.getConnection(async (conn) => conn);
    for (let i = 0; i < lockerIds.length; i++) {
      nemoDao.insertLocker(connection, department, lockerIds[i]);
    }
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (error) {
    console.error(`nemoService - createLocker error: ${error}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 요청 테이블 생성
exports.createLockerRequest = async function (department, userId, lockerId, status, note) {
  // status: request or return
  try {
    const insertLockerRequestParams = [userId, lockerId, department, status];
    const connection = await pool.getConnection(async (conn) => conn);

    await nemoDao.updateLocker(connection, [department, lockerId, status, note, userId]);

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (error) {
    console.error(`nemoService - createLockerRequest error: ${error}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 요청 테이블 삭제 + 해당 사물함 상태 empty로 변경
exports.deleteLockerRequest = async function (department, userId, lockerId, status, note) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    await nemoDao.updateLocker(connection, [department, lockerId, status, note, userId]);

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (error) {
    console.error(`nemoService - deleteLockerRequest error: ${error}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 사물함 정보 업데이터
exports.updateLocker = async function (fk_department, locker_id, status, note, fk_user_id) {
  try {
    const updateLockerParams = [fk_department, locker_id, status, note, fk_user_id];
    const connection = await pool.getConnection(async (conn) => conn);

    await nemoDao.updateLocker(connection, updateLockerParams);

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (error) {
    console.error(`nemoService - updateLocker error: ${error}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
