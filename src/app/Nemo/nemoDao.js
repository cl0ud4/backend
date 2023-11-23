// 학과로 사물함정보 조회
async function selectLockersInfo(connection, department) {
  const selectLockersInfoQuery = `
        SELECT *
        FROM lockers_info
        WHERE fk_department = ?;
    `;
  const [lockersInfoRows] = await connection.query(selectLockersInfoQuery, department);
  return lockersInfoRows;
}

// 사물함정보 생성
async function insertLockersInfo(connection, insertLockersInfoParams) {
  const insertLockersInfoQuery = `
        INSERT INTO lockers_info
        VALUES (?, ?, ?, ?, ?, ?);
    `;
  const insertLockersInfoRows = await connection.query(insertLockersInfoQuery, insertLockersInfoParams);
  return insertLockersInfoRows;
}

// 학과로 사물함정보 수정
async function updateLockersInfo(connection, editLockersInfoParams) {
  const updateLockersInfoQuery = `
        UPDATE lockers_info
        SET
        location = ?,
        deposit = ?
        WHERE fk_department = ?;
    `;
  const updateLockersInfoRow = await connection.query(updateLockersInfoQuery, editLockersInfoParams);
  return updateLockersInfoRow[0];
}

// 학과로 모든 사물함 리스트 조회
async function selectLockerList(connection, department) {
  const selectLockerListQuery = `
          SELECT fk_department, locker_id, status, note, fk_user_id
          FROM locker
          WHERE fk_department = ?
          ORDER BY created_id;
      `;
  const [lockersInfoRows] = await connection.query(selectLockerListQuery, department);
  return lockersInfoRows;
}

// 학과로 행 정보 조회
async function selectLockersInfoRow(connection, department) {
  const selectLockersInfoRowQuery = `
        SELECT lockers_info.row
        FROM lockers_info
        WHERE fk_department = ?;
  `;
  const row = await connection.query(selectLockersInfoRowQuery, department);
  return row[0][0].row;
}

// 학과로 열 정보 조회
async function selectLockersInfoCol(connection, department) {
  const selectLockersInfoColQuery = `
    SELECT lockers_info.col
    FROM lockers_info
    WHERE fk_department = ?;
  `;
  const col = await connection.query(selectLockersInfoColQuery, department);
  return col[0][0].col;
}

// user_id로 학과 조회
async function selectDepartmentById(connection, user_id) {
  const selectDepartmentByIdQeury = `
   SELECT user.department
   FROM user
   WHERE id = ?
  `;
  const selectDepartmentByIdRow = await connection.query(selectDepartmentByIdQeury, user_id);
  return selectDepartmentByIdRow[0];
}

// user_id로 사물함 조회
async function selectLockerByUserId(connection, lockerRentCheckParams) {
  const selectLockerByUserIdQeury = `
   SELECT *
   FROM locker
   WHERE fk_department = ? AND fk_user_id = ?
  `;
  const selectLockerByUserIdRow = await connection.query(selectLockerByUserIdQeury, lockerRentCheckParams);
  return selectLockerByUserIdRow[0];
}

// 모든 사물함 삭제
async function deleteLockers(connection, department) {
  try {
    await connection.beginTransaction();  //트랜잭션 적용
    const deleteLockersQeury = `
      DELETE
      FROM locker
      WHERE fk_department = ?;
    `;
    await connection.query(deleteLockersQeury, department);
    const deleteLockersInfoQeury = `
      DELETE
      FROM lockers_info
      WHERE fk_department = ?;
    `;
    const deleteLockersInfoRow = await connection.query(deleteLockersInfoQeury, department);
    
    await connection.commit();
    return deleteLockersInfoRow;

  } catch(err){
    connection.rollback();

  } finally {
    connection.release();
  }
}

// 사물함 1개 생성
async function insertLocker(connection, department, lockerId) {
  const insertLockerQuery = `
        INSERT INTO locker
        VALUES(?, ?, "empty", "", NULL, NULL, DEFAULT);
    `;
  const insertLockerRow = await connection.query(insertLockerQuery, [department, lockerId]);

  return insertLockerRow;
}

// 사물함 1개 업데이트
// params: fk_department, locker_id, status, note, fk_user_id
async function updateLocker(connection, updateLockerParams) {
  let department = updateLockerParams[0];
  let locker_id = updateLockerParams[1];
  let status = updateLockerParams[2];
  let note = updateLockerParams[3];
  let user_id = updateLockerParams[4];

  const updateLockerQuery = `
        UPDATE locker 
        SET status = ?, note = ?, fk_user_id = ? 
        WHERE fk_department = ? AND locker_id = ?
      `;
  if (status === "empty") {
    note = "";
    user_id = null;
  }
  const params = [status, note, user_id, department, locker_id];
  const updateLocker = await connection.query(updateLockerQuery, params);

  return updateLocker;
}

// 대여요청 생성
async function insertLockerRequest(connection, insertLockerRequestParams) {
  // request_id, fk_user_id, fk_locker_id, fk_department
  const insertLockerRequestQuery = `
        INSERT INTO locker_request
        VALUES(0, ?, ?, ?);
    `;
  const insertLockerRequestRow = await connection.query(insertLockerRequestQuery, insertLockerRequestParams);

  return insertLockerRequestRow;
}

// 대여요청 삭제
async function deleteLockerRequest(connection, userId) {
  const deleteLockerRequestQuery = `
          DELETE
          FROM locker_request
          WHERE fk_user_id = ?;
      `;
  const deleteLockerRequestRow = await connection.query(deleteLockerRequestQuery, userId);

  return deleteLockerRequestRow;
}

// 사물함 상태만 변경
async function updateLockerStatus(connection, userId, status) {
  if (status === "empty") {
    userId = null;
  }

  const updateLockerStatusQuery = `
    UPDATE locker
    SET status = ?
    WHERE fk_user_id = ?;
    `;

  const updateLockerStatusRow = await connection.query(updateLockerStatusQuery, [status, userId]);
  return updateLockerStatusRow;
}

module.exports = {
  selectLockersInfo,
  insertLockersInfo,
  updateLockersInfo,
  selectLockerList,
  selectLockersInfoRow,
  selectLockersInfoCol,
  selectDepartmentById,
  selectLockerByUserId,
  deleteLockers,
  insertLocker,
  updateLocker,
  insertLockerRequest,
  deleteLockerRequest,
  updateLockerStatus,
};
