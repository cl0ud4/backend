const { cornflowerblue } = require("color-name");
const { pool } = require("../../../config/database");
const nemoDao = require("./nemoDao");

// Provider: Read 로직 처리

// 과사물함 정보 조회
exports.retrieveLockersInfo = async function (department) {
  const connection = await pool.getConnection(async (conn) => conn);

  const lockersInfoResult = await nemoDao.selectLockersInfo(connection, department);

  connection.release();

  return lockersInfoResult;
};

// 과사물함 전체 사물함 조회
exports.retrieveLockerList = async function (department) {
  const connection = await pool.getConnection(async (conn) => conn);

  const lockerListResult = await nemoDao.selectLockerList(connection, department);

  connection.release();

  return lockerListResult;
};

// user_id로 학과 조회
exports.retrieveDepartment = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);

  const retrieveDepartmentResult = await nemoDao.selectDepartmentById(connection, user_id);

  connection.release();

  return retrieveDepartmentResult;
};

// 과사물함 전체 개수 반환
exports.allLockerCount = async function (department) {
  const connection = await pool.getConnection(async (conn) => conn);

  const row = await nemoDao.selectLockersInfoRow(connection, department);
  const col = await nemoDao.selectLockersInfoCol(connection, department);

  connection.release();

  return parseInt(row * col);
};

// 사물함 전체 상태가 empty인지 체크
exports.emptyCheck = async function (department) {
  const connection = await pool.getConnection(async (conn) => conn);

  const lockerListResult = await nemoDao.selectLockerList(connection, department);
  const row = await nemoDao.selectLockersInfoRow(connection, department);
  const col = await nemoDao.selectLockersInfoCol(connection, department);

  connection.release();

  const lockerCount = row * col;

  for (let i = 0; i < lockerCount; i++) {
    if (lockerListResult[i].status !== "empty") return false;
  }
  return true;
};

// 사물함정보 체크
exports.lockerInfoCheck = async function (department) {
  const connection = await pool.getConnection(async (conn) => conn);
  const lockerInfoCheckResult = await nemoDao.selectLockersInfo(connection, department);
  connection.release();

  return lockerInfoCheckResult;
};

// user_id가 대여한 사물함 조희
exports.lockerRentCheck = async function (department, user_id) {
  const lockerRentCheckParams = [department, user_id];

  const connection = await pool.getConnection(async (conn) => conn);
  const lockerRentCheckResult = await nemoDao.selectLockerByUserId(connection, lockerRentCheckParams);
  connection.release();

  if (lockerRentCheckResult.length) {
    return lockerRentCheckResult;
  } else {
    return null;
  }
};
