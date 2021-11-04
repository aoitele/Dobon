import { prisma, Prisma } from '.'

type RowQueryMethod = 'GameBoardUsersInit'

export interface QueryMethod {
  model: Prisma.ModelName
  method?: Prisma.PrismaAction | RowQueryMethod
}

const prismaExec = (req: QueryMethod, data: any): any => {
  try {
    switch(req.model) {
      case 'Participant':
        if (req.method === 'create') {
          prisma.participant.create({ data })
        }
      break;
      default: return {}
    }        
  } catch(e) {
    return {
      result: false,
      error: e
    }
  }
  return {}
}
const rowQuery = (req: QueryMethod):string => {
  switch(req.model) {
    case 'Participant':
      if (req.method === 'GameBoardUsersInit')
      return `
      SELECT
        U.id,
        U.nickname,
        ROW_NUMBER() OVER(ORDER BY U.id) AS turn,
        0 AS score
      FROM users U, participants P
      WHERE U.id = P.user_id
      `
    break;
    default: return ''
  }
  return ''
}

export {prismaExec, rowQuery}