const { pool } = require("../../../config/database");
const questionProvider = require("./questionProvider");
const questionDao = require("./questionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

exports.createQuestion = async function (title, content, writer_id) {
    try{
        const insertQuestionParams = [title, content, writer_id];
        const connection = await pool.getConnection(async (conn) => conn);

        const createQuestionResult = await questionDao.insertQuestion(connection, insertQuestionParams);
        const postNo = await questionProvider.retrievePostQuestionNo();
        connection.release();
        return postNo;

    } catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteQuestion = async function(questionId, id) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteQuestionResult = await questionDao.deleteQuestion(connection, questionId);
        connection.release();
        return response(baseResponse.SUCCESS);

    }catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createAnswer = async function(title, content, questionId) {
    try{
        // 답변 작성 유무 확인
        const answerCheck = await questionProvider.answerCheck(questionId);
        if (answerCheck === true) // 답변 작성 후
            return errResponse(baseResponse.ANSWER_ALREADY_EXIST);
        
        const insertQuestionParams = [title, content, questionId];
        // 답변 작성 전 
        const connection = await pool.getConnection(async (conn) => conn);
        const createAnswerResult = await questionDao.insertAnswer(connection, insertQuestionParams);
        const updateState = await questionDao.updateState(connection, questionId);
        connection.release();
        
        return response(baseResponse.SUCCESS);
        } catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteAnswer = async function(questionId, id) {
    try{
        // 답변 작성 유무 확인
        const answerCheck = await questionProvider.answerCheck(questionId);
        if (answerCheck === false) // 답변 작성 전
            return errResponse(baseResponse.ANSWER_NOT_EXIST);
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteAnswerResult = await questionDao.deleteAnswer(connection, questionId);
        const answerStateUdpate = await questionDao.updateAnswerState(connection, questionId);
        connection.release();
        return response(baseResponse.SUCCESS);

    }catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createNotice = async function(department, title, content){
    try{
        const insertNoticeParams = [department, title, content];
        // 답변 작성 전 
        const connection = await pool.getConnection(async (conn) => conn);
        const createNoticeResult = await questionDao.insertNotice(connection, insertNoticeParams);
        const postNo = await questionProvider.retrievePostNoticeNo();
        connection.release();
        return postNo;
        
        } catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteNotice = async function(noticeId){
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteNoticeResult = await questionDao.deleteNotice(connection, noticeId);
        connection.release();
        return response(baseResponse.SUCCESS);

    }catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createSMS = async function(content){
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const createSMSResult = await questionDao.insertSMS(connection, content);
        connection.release();
        
        return response(baseResponse.SUCCESS);
        } catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
}