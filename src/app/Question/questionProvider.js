const { pool } = require("../../../config/database");
const questionDao = require("./questionDao");
const { response, errResponse } = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

// Provider: Read 로직 처리
exports.retrieveQuestionList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const questionListResult = await questionDao.selectQuestions(connection);
  connection.release();

  return questionListResult;
};

exports.questionWriterCheck = async function (questionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const questionWriterCheckResult = await questionDao.selectQuestionWriter(connection, questionId);
  connection.release();

  return questionWriterCheckResult;
};

exports.retrieveQuestion = async function (questionId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const questionResult = await questionDao.selectQuestion(connection, questionId);
    connection.release();
    return questionResult;
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.answerCheck = async function (questionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const answerCheckResult = await questionDao.selectAnswerCheck(connection, questionId);
  connection.release();
  return answerCheckResult;
};

exports.retrieveAnswer = async function (questionId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const answerResult = await questionDao.selectAnswer(connection, questionId);
    connection.release();
    return answerResult;
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 전체 문의글 개수 반환
exports.cntCheck = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const answerCheckResult = await questionDao.selectCntCheck(connection);
  connection.release();
  return answerCheckResult;
};

exports.getPageList = async function (page) {
  const connection = await pool.getConnection(async (conn) => conn);

  const limit = 10; // 보여질 페이지수
  const offset = 10 * (page - 1);

  const getPageListResult = await questionDao.selectPageList(connection, offset, limit);
  connection.release();
  return getPageListResult;
};

exports.adminCheck = async function (id) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const adminCheckResult = await questionDao.adminCheck(connection, id);
    connection.release();

    return adminCheckResult[0];
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getPageCnt = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const getPageCntResult = await questionDao.getPageCnt(connection);
  connection.release();
  return getPageCntResult;
};

exports.getPageCntDep = async function (department) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getPageCntResult = await questionDao.getPageCntDep(connection, department);
  connection.release();
  return getPageCntResult;
};

exports.retrievePostQuestionNo = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const postNoResult = await questionDao.getPostQuestionNo(connection);
  connection.release();
  return postNoResult;
};

exports.retrievePostNoticeNo = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const postNoResult = await questionDao.getPostNoticeNo(connection);
  connection.release();
  return postNoResult;
};

exports.retrieveNoticeList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const noticeListResult = await questionDao.selectNotices(connection);
  connection.release();

  return noticeListResult;
};

exports.retrieveNotice = async function (noticeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const noticeResult = await questionDao.selectNotice(connection, noticeId);
    connection.release();
    return noticeResult;
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.retrieveSMS = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const smsResult = await questionDao.selectSMS(connection);
  connection.release();

  return smsResult;
};

exports.retrieveDep = async function (id) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const departmentResult = await questionDao.selectDepartment(connection, id);
    connection.release();

    return departmentResult[0].department;
  } catch (err) {
    console.log(err);
  }
};

exports.retrivePhoneList = async function (department) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const phoneResult = await questionDao.selectPhone(connection, department);
    connection.release();

    return phoneResult;
  } catch (err) {
    console.log(err);
  }
};

exports.retrieveQuestionDepList = async function (department) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const questionDepListResult = await questionDao.selectQuestionDep(connection, department);
    connection.release();
    return questionDepListResult;
  } catch (err) {
    console.log(err);
  }
};
