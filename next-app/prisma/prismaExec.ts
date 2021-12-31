import { NextApiResponse } from 'next'
import { prisma, Prisma } from '.'
import index from './model/participant'

type RowQueryMethod = 'GameBoardUsersInit'

export interface QueryMethod {
  model: Prisma.ModelName
  method?: Prisma.PrismaAction | RowQueryMethod
  params?: any[string]
}

const prismaExec = (req: QueryMethod, res:NextApiResponse, data: any): any => {
  if (prisma === null) { return res.status(500).json({ error: 'PrismaClientInitializationError'})}

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
const rowQuery = (req: QueryMethod) => {
  if (req.model && req.method) {
    const query = index(req.params)
    return query
  }
  return ''
}

export {prismaExec, rowQuery}