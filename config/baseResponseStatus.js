module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    /* USER */
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },
    USER_DEPARTMENT_EXIST : { "isSuccess": false, "code": 2014, "message": "관리자가 이미 존재하는 학과입니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    USER_FIND_FAIL : { "isSuccess": false, "code": 2019, "message": "회원 조회 실패" },
    USER_EDIT_FAIL : { "isSuccess": false, "code": 2019, "message": "회원 정보 수정 실패" },
    USER_LOGOUT_FAIL : { "isSuccess": false, "code": 2020, "message": "로그아웃 실패" },
    USER_DELETE_FAIL : { "isSuccess": false, "code": 2021, "message": "회원 탈퇴 실패" },
    SIGNUP_LOCKER_NOT_EXIST : { "isSuccess": false, "code": 2022, "message": "학과 사물함이 존재하지 않습니다." },
    SIGNUP_REDUNDANT_ID : { "isSuccess": false, "code": 2023, "message": "중복된 아이디입니다." },
    USER_ADMIN_NOT_DELETE : { "isSuccess": false, "code": 2024, "message": "관리자는 탈퇴할 수 없습니다." },


    POSTQUESTION_TITLE_EMPTY:{"isSuccess": false, "code": 2300, "message": "Q&A 제목을 입력해주세요."},
    POSTQUESTION_TITLE_LENGTH:{"isSuccess": false, "code": 2301, "message": "Q&A 제목을 100자리 미만으로 입력해주세요."},
    QUESTION_QUESTIONID_EMPTY:{"isSuccess": false, "code": 2303, "message": "QuestionId가 비었습니다."},
    QUESTION_AUTH:{"isSuccess": false, "code": 2304, "message": "해당 문의글 삭제 권한이 없습니다."},
    POSTANSWER_TITLE_EMPTY:{"isSuccess": false, "code": 2305, "message": "답변 제목을 입력해주세요."},
    POSTANSWER_TITLE_LENGTH:{"isSuccess": false, "code": 2306, "message": "답변 제목을 100자리 미만으로 입력해주세요."},
    ANSWER_ALREADY_EXIST: {"isSuccess": false, "code": 2307, "message": "이미 답변 작성한 문의글입니다."},
    ANSWER_QUESTIONID_EMPTY:{"isSuccess": false, "code": 2308, "message": "QuestionId가 비었습니다."},
    ANSWER_NOT_EXIST: {"isSuccess": false, "code": 2309, "message": "해당 문의글에 작성된 답변이 없습니다."},
    ANSWER_NO_ADMIN: {"isSuccess": false, "code": 2310, "message": "ADMIN 계정이 아닙니다."},
    USER_DEPARTMENT_NOT_EXIST : { "isSuccess": false, "code": 2019, "message": "해당 회원의 학과명이 존재하지 않습니다" },
    POSTQUESTION_CONTENT_EMPTY:{"isSuccess": false, "code": 2311, "message": "Q&A 내용을 입력해주세요."},
    POSTANSWER_CONTENT_EMPTY:{"isSuccess": false, "code": 2312, "message": "답변 내용을 입력해주세요."},
    NOTICE_NOTICEID_EMPTY:{"isSuccess": false, "code": 2313, "message": "NoticeId가 비었습니다."},
    POSTSMS_CONTENT_EMPTY:{"isSuccess": false, "code": 2314, "message": "SMS 내용이 비었습니다."},
    POSTSMS_CONTENT_LENGTH:{"isSuccess": false, "code": 2315, "message": "SMS 내용을 100자리 미만으로 입력해주세요."},
    SMS_SEND_FAILURE:{ "isSuccess": false,"code": 2316,"message":"문자 발신에 실패했습니다." },
    DEPERTMENT_NO_ADMIN: {"isSuccess": false, "code": 2310, "message": "ADMIN의 학과가 존재하지 않습니다."},
    USER_DO_NOT_EXSIT: {"isSuccess": false, "code": 2311, "message": "해당 유저가 존재하지 않습니다."},

    /* NEMO */
    LOCKER_STATUS_EMPTY : { "isSuccess": false, "code": 3100, "message": "사물함은 최소 1 * 1 행렬입니다" },
    LOCKER_DEPARTMENT_NOT_CORRECT : { "isSuccess": false, "code": 3101, "message": "일치하지 않는 학과의 학생입니다" },
    USER_ALREADY_GET_LOCKER : { "isSuccess": false, "code": 3102, "message": "사물함은 1명당 1개를 대여할 수 있습니다" },
    NOT_ADMIN : { "isSuccess": false, "code": 3103, "message": "해당 기능은 관리자만 접근할 수 있습니다" }, 
    
    // Response error
    /* USER */
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },
    
    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    
    /* NEMO */
    LOCKER_DELETE_FAILED: { "isSuccess": false, "code": 3101, "message": "사물함 전체 데이터 삭제에 실패하였습니다." },
    LOCKER_NUMBERING_FALIED: { "isSuccess": false, "code": 3102, "message": "사물함 번호 부여에 실패하였습니다." },
    LOCKER_SEARCH_FAILED: { "isSuccess": false, "code": 3103, "message": "학과 전체 사물함 조회에 실패하였습니다." },
    LOCKER_NOT_EXIST: { "isSuccess": false, "code": 3104, "message": "학과 사물함이 존재하지 않습니다." },

    RENT_REQUEST_FAILED: { "isSuccess": false, "code": 3110, "message": "사물함 대여 요청에 실패하였습니다." },
    CANCEL_REQUEST_FAILED: { "isSuccess": false, "code": 3111, "message": "사물함 대여취소 요청에 실패하였습니다." },
    RETURN_REQUEST_FAILED: { "isSuccess": false, "code": 3112, "message": "사물함 반납 요청에 실패하였습니다." },
    CANCEL_RETURN_REQUEST_FAILED: { "isSuccess": false, "code": 3113, "message": "사물함 반납취소 요청에 실패하였습니다." },

    LOCKER_NON_EMPTY: {"isSuccess": false, "code": 3114, "message": "모든 사물함이 반납 상태가 아니므로 삭제할 수 없습니다." },
    LOCKER_ALREADY_EXISTS: {"isSuccess": false, "code": 3115, "message": "생성한 학과 사물함이 이미 존재합니다." },

    USER_NOT_RENT_LOCKER : {"isSuccess": false, "code": 3116, "message": "사용자가 대여한 사물함이 없습니다." },
    LOCKER_INFO_CHANGE_FAILED : {"isSuccess": false, "code": 3117, "message": "사물함 변경 요청 신청에 실패하였습니다." },
    USER_NOT_OWNER : {"isSuccess": false, "code": 3118, "message": "해당 회원은 사물함의 주인이 아닙니다." },
    SEND_MAIL_FAILED  :{"isSuccess": false, "code": 3119, "message": "인증 메일 발송에 실패하였습니다" },
    CHECK_MAIL_FAILED  :{"isSuccess": false, "code": 3120, "message": "회원가입 인증번호가 틀렸습니다" },
    CHECK_VALID_USER  :{"isSuccess": false, "code": 3121, "message": "인증 완료한 회원 아이디가 아닙니다" },
    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
