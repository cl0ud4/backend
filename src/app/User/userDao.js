module.exports = {
  creatUser,
  createAdmin,
  findUserById,
  updateUserById,
  checkRepeatId,
  updateUserById,
  deleteUser,
  selectUserId,
  selectUserPassword,
  selectAdminId,
  userCheck,
  adminCheck,
  selectAdminPassword,
};

// 사용자 생성
async function creatUser(connection, id, password, phoneNumber, department, permission) {
  const insertUserInfoQuery = `INSERT INTO user VALUES ('${id}', '${password}', '${phoneNumber}', '${department}', '${permission}');`;
  const result = await connection.query(insertUserInfoQuery);

  return result;
}

// 관리자 생성
async function createAdmin(connection, p) {
  const insertAdminInfoQuery = `INSERT INTO admin(id, password, department, permission) VALUES (?,?,?,?);`;
  const result = await connection.query(insertAdminInfoQuery, p);

  return result;
}

// 사용자 검색
async function findUserById(connection, id) {
  const selectUserQuery = `
        SELECT id
        FROM user
        WHERE id = ?;
    `;
  const [userRow] = await connection.query(selectUserQuery, id);
  return userRow;
}

// 중복 사용자 검색
async function checkRepeatId(connection, id) {
  const selectUserQuery = `
        SELECT id
        FROM user
        WHERE id = ?;
    `;
  const [userRow] = await connection.query(selectUserQuery, id);
  return userRow;
}

// 사용자 정보 수정
async function updateUserById(connection, id, phoneNumber) {
  const updateUserQuery = `
        UPDATE user
        SET phoneNumber = '${phoneNumber}'
        WHERE id = '${id}';
    `;
  const [updateUserRow] = await connection.query(updateUserQuery, id, phoneNumber);
  return updateUserRow;
}

// 사용자 삭제
async function deleteUser(connection, id) {
  const deleteUserQuery = `
            DELETE FROM user
            WHERE id = '${id}';
        `;
  const [deleteUserRow] = await connection.query(deleteUserQuery, id);
  return deleteUserRow;
}

// id로 사용자 정보 조회
async function selectUserId(connection, id) {
  const selectUserIdQuery = `
                  SELECT *
                  FROM user 
                  WHERE id = '${id}';
                  `;
  const [Rows] = await connection.query(selectUserIdQuery, id);
  return Rows;
}

async function selectUserPassword(connection, id) {
  const selectUserPasswordQuery = `
                  SELECT password
                  FROM user 
                  WHERE id = '${id}';
                  `;
  const [Rows] = await connection.query(selectUserPasswordQuery, id);
  return Rows;
}

async function selectAdminPassword(connection, id) {
  const selectUserPasswordQuery = `
                  SELECT password
                  FROM admin 
                  WHERE id = ?;
                  `;
  const [Rows] = await connection.query(selectUserPasswordQuery, id);
  return Rows[0];
}

// id로 관리자 정보조회
async function selectAdminId(connection, id) {
  const selectUserIdQuery = `
                  SELECT *
                  FROM admin 
                  WHERE id = '${id}';
                  `;
  const [Rows] = await connection.query(selectUserIdQuery, id);
  return Rows;
}

async function userCheck(connection, userid) {
  const selectUserIdQuery = `
                  SELECT *
                  FROM user 
                  WHERE id = '${userid}';
                  `;
  const [Rows] = await connection.query(selectUserIdQuery);
  return Rows;
}

async function adminCheck(connection, userid) {
  const selectUserIdQuery = `
                  SELECT *
                  FROM admin 
                  WHERE id = ?;
                  `;
  const [Rows] = await connection.query(selectUserIdQuery, userid);
  return Rows;
}