const { pool } = require("../../../config/database");
const userDao = require("./userDao");

// Provider: Read 로직 처리

exports.checkUserId = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await userDao.selectUserId(connection, id);
  connection.release();

  return result;
};

exports.checkAdminId = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await userDao.selectAdminId(connection, id);
  connection.release();

  return result;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(connection, selectUserPasswordParams);
  connection.release();

  return passwordCheckResult[0].password;
};

exports.passwordAdminCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectAdminPassword(connection, selectUserPasswordParams);
  connection.release();

  return passwordCheckResult.password;
};

// 중복 id 확인
exports.checkRepeatId = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdResult = await userDao.selectUserId(connection, id);

  connection.release();

  return userIdResult;
};

exports.userCheck = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await userDao.userCheck(connection, id);

  connection.release();
  return userCheckResult;
};

exports.adminCheck = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await userDao.adminCheck(connection, id);

  connection.release();
  return userCheckResult;
};
