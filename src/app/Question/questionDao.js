async function selectQuestions(connection){
    const selectQuestionListQuery = `
            SELECT q.title, q.question_id, date_format(q.created_date,'%Y-%m-%d') as created_date, IF(q.state=0,'답변대기','답변완료') as state, u.department
            FROM question q JOIN user u ON q.writer_id = u.id
            order by question_id desc;
    `
    const [questionRows] = await connection.query(selectQuestionListQuery);
    return questionRows;
}

async function insertQuestion(connection, insertQuestionParams){
    const insertQuestionQuery = `
            INSERT INTO question(title, content, writer_id) 
            VALUES(?, ?, ?);
    `;

    const [insertQuestionRows] = await connection.query(insertQuestionQuery, insertQuestionParams);
    return insertQuestionRows;
}

async function selectQuestionWriter(connection, questionId){
    const selectWriterQuery = `
            SELECT writer_id
            FROM question
            WHERE question_id = ?;
    `
    const [writerRows] = await connection.query(selectWriterQuery, questionId);
    return writerRows;
}

async function deleteQuestion(connection, questionId){
    const deleteQuestionQuery = `
        DELETE FROM question
        WHERE question_id = ?;
    `
    const deleteQuestionRows = await connection.query(deleteQuestionQuery, questionId);
    return deleteQuestionRows;

}


async function selectQuestion(connection, questionId){
    const selectQuestionQuery = `
        SELECT question_id, writer_id, title, content, date_format(created_date,'%Y-%m-%d') as created_date
        FROM question
        WHERE question_id = ?;
    `
    const [questionRow] = await connection.query(selectQuestionQuery, questionId);
    return questionRow;
}

async function insertAnswer(connection, insertQuestionParams){
    const insertAnswernQuery = `
            INSERT INTO answer(title, content, question_id) 
            VALUES(?,?,?);
    `;

    const insertAnswerRows = await connection.query(insertAnswernQuery, insertQuestionParams);
    return insertAnswerRows;
}

async function selectQuestionWriter(connection, questionId){
    const selectWriterQuery = `
            SELECT writer_id
            FROM question
            WHERE question_id = ?;
    `
    const [writerRows] = await connection.query(selectWriterQuery, questionId);
    return writerRows;
}

async function selectAnswerCheck(connection, questionId){
    const selectAnswerQuery = `
        SELECT title, content
        FROM answer
        WHERE question_id = ?;
    `
    const [answerRow] = await connection.query(selectAnswerQuery, questionId);
    if (answerRow.length > 0) // 답변 작성 완료
        return true;
    else // 답변 작성 미완료
        return false;
}

async function selectAnswer(connection, questionId){
    const selectAnswerQuery = `
        SELECT answer_id, title, content, date_format(created_date,'%Y-%m-%d') as created_date
        FROM answer
        WHERE question_id = ?;
    `
    const [answerRow] = await connection.query(selectAnswerQuery, questionId);
    return answerRow;
}

async function deleteAnswer(connection, questionId){
    const deleteAnswerQuery = `
        DELETE FROM answer
        WHERE question_id = ?;
    `
    const deleteAnswerRows = await connection.query(deleteAnswerQuery, questionId);
    return deleteAnswerRows;

}

async function updateAnswerState(connection, questionId){
    const updateStateQuery = `
    UPDATE question
    SET state = 0
    WHERE question_id = ${questionId}; 
    `
    const updateStateResult = await connection.query(updateStateQuery);
    return updateStateResult;
}

async function selectCntCheck(connection) {
    const selectCntCheckrQuery = `
        SELECT COUNT(*) FROM question;
    `
    const [cntRow] = await connection.query(selectCntCheckrQuery);
    return cntRow;
}

async function selectPageList(connection, offset, limit){
    const selectQuestionListQuery = `
        SELECT title, question_id, date_format(created_date,'%Y-%m-%d') as created_date
        FROM question
        order by question_id desc limit ${offset}, ${limit};
    `
    const [questionRows] = await connection.query(selectQuestionListQuery);
    return questionRows;
}

async function adminCheck(connection, id){
    const sadminCheckQuery = `
        SELECT *
        FROM admin
        WHERE id = '${id}';
    `
    const [adminCheckRow] = await connection.query(sadminCheckQuery);
    return adminCheckRow;
}

async function getPageCnt(connection){
    const getPageCntQuery = `
        SELECT count(question_id) as cnt, max(question_id) as lastpage
        FROM question
    `
    const [getPageCnt] = await connection.query(getPageCntQuery);
    return getPageCnt;
}

async function getPageCntDep(connection,department){
    const getPageCntQuery = `
        SELECT count(*) as cnt
        FROM question q JOIN user u ON q.writer_id = u.id
        WHERE u.department='${department}';
    `
    const [getPageCnt] = await connection.query(getPageCntQuery);
    return getPageCnt;
}

async function updateState(connection, questionId){
    const updateStateQuery = `
    UPDATE question
    SET state = 1
    WHERE question_id = ${questionId}; 
    `
    const updateStateResult = await connection.query(updateStateQuery);
    return updateStateResult;
}

async function getPostQuestionNo(connection){
    const getPostQuestionNoQuery = `
    SELECT max(question_id) as question_id FROM question;
`
const [getPostNo] = await connection.query(getPostQuestionNoQuery);
return getPostNo;
}

async function getPostNoticeNo(connection){
    const getPostNoticeNoQuery = `
    SELECT max(notice_id) as notice_id FROM notice;
`
const [getPostNo] = await connection.query(getPostNoticeNoQuery);
return getPostNo;
}

async function insertNotice(connection, insertNoticeParams) {
    const insertNoticeQuery = `
            INSERT INTO notice(department, title, content) 
            VALUES(?,?,?);
    `;

    const insertNoticeRows = await connection.query(insertNoticeQuery, insertNoticeParams);
    return insertNoticeRows;
}

async function selectNotices(connection){
    const selectNoticeListQuery = `
    SELECT title, notice_id, date_format(created_date,'%Y-%m-%d') as created_date
    FROM notice
    order by notice_id desc;
`
const [noticeRows] = await connection.query(selectNoticeListQuery);
return noticeRows;
}

async function selectNotice(connection, noticeId){
    const selectNoticeQuery = `
        SELECT notice_id, title, content, date_format(created_date,'%Y-%m-%d') as created_date
        FROM notice
        WHERE notice_id = ?;
    `
    const [noticeRow] = await connection.query(selectNoticeQuery, noticeId);
    return noticeRow;
}

async function deleteNotice(connection, noticeId){
    const deleteNoticeQuery = `
    DELETE FROM notice
    WHERE notice_id = ?;
`
const deleteNoticeRows = await connection.query(deleteNoticeQuery, noticeId);
return deleteNoticeRows;
}

async function insertSMS(connection, content){
    const insertSMSQuery = `
            INSERT INTO sms(sms_content) 
            VALUES(?);
    `;

    const insertSMSRows = await connection.query(insertSMSQuery, content);
    return insertSMSRows;
}

async function selectSMS(connection){
    const selectSMSQuery = `
    SELECT sms_content 
    FROM sms 
    WHERE sms_id = (SELECT max(sms_id) FROM nemo.sms);
    `;

    const [selectSMSRows] = await connection.query(selectSMSQuery);
    return selectSMSRows;
}

async function selectDepartment(connection, id){
    const selectDepartmentQuery = `
        SELECT department 
        FROM admin 
        WHERE id = '${id}';
    `;

    const [selectDepRows] = await connection.query(selectDepartmentQuery);
    return selectDepRows;
}

async function selectPhone(connection, department){
    const selectPhoneQuery = `
    SELECT phoneNumber
    FROM user 
    WHERE department = '${department}';
`;

const [selectPhoneRows] = await connection.query(selectPhoneQuery);
return selectPhoneRows;
}

async function selectQuestionDep(connection, department){
    const selectQuestionDepQuery = `
            SELECT q.title, q.question_id, date_format(q.created_date,'%Y-%m-%d') as created_date, IF(q.state=0,'답변대기','답변완료') as state, u.department
            FROM question q JOIN user u ON q.writer_id = u.id
            WHERE department = '${department}'
            order by question_id desc;
    `
    const [questionRows] = await connection.query(selectQuestionDepQuery);
    return questionRows;
}

module.exports = {
    selectQuestions,
    insertQuestion,
    selectQuestionWriter,
    deleteQuestion,
    selectQuestion,
    insertAnswer,
    selectAnswerCheck,
    selectAnswer,
    deleteAnswer,
    selectCntCheck,
    selectPageList,
    adminCheck,
    getPageCnt,
    updateState,
    getPostQuestionNo,
    insertNotice,
    selectNotices,
    selectNotice,
    deleteNotice,
    insertSMS,
    selectSMS,
    getPostNoticeNo,
    selectDepartment,
    selectPhone,
    selectQuestionDep,
    updateAnswerState,
    getPageCntDep
};
