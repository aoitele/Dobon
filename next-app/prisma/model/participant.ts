const gameBoardUsersInit = (roomId: any) => {
  const sql = `
  SELECT
    U.id,
    U.nickname,
    ROW_NUMBER() OVER(ORDER BY U.id) AS turn,
    0 AS score
  FROM users U, participants P
  WHERE U.id = P.user_id
  AND P.room_id = '${roomId}'
  `
  return sql
}

const index = (params: any) => {
  const { roomId } = params
  const query = gameBoardUsersInit(roomId)
  return query
}

export default index