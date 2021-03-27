import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ["query", "error", "info", "warn"],
})

async function main() {
    console.log('main fire2')
    const allUsers = await prisma.users.findMany().catch(err => console.log(err, 'err'))
    return allUsers
}

main()
  .catch(e => {
    console.log(e)
  })

export default main;