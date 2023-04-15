import { Player } from "../../../../@types/game"
import { NestedPartial } from "../../../../@types/utility"
import { dobonJudge } from "../../dobonJudge"

interface Args {
  redisPipeLineResults: [Error | null, any][]
  trashUser: NestedPartial<Player>
  trashCard: string
  users: NestedPartial<Player>[]
}

const checkDobonPlayers = ({
  redisPipeLineResults,
  trashUser,
  trashCard,
  users,
}: Args) => {
  let [canCom1Dobon, canCom2Dobon, canCom3Dobon, canIDobon] = [false, false, false, false]
  console.log(redisPipeLineResults, '------------------------redisPipeLineResults------------------------')
  console.log(trashUser, '------------------------trashUser------------------------')

  const com1Hands = redisPipeLineResults[0][1]
  const com2Hands = redisPipeLineResults[1][1]
  const com3Hands = redisPipeLineResults[2][1]
  const myHands = redisPipeLineResults[3][1] // 自分の手札はcpuDobonの時のみ利用するのでオプショナルとしておく

  const me = users.find(user => !user.isCpu)
  canCom1Dobon = trashUser.nickname !== 'com1' && dobonJudge(trashCard, com1Hands)
  canCom2Dobon = trashUser.nickname !== 'com2' && dobonJudge(trashCard, com2Hands)
  canCom3Dobon = trashUser.nickname !== 'com3' && dobonJudge(trashCard, com3Hands)
  canIDobon = trashUser.nickname !== me?.nickname && dobonJudge(trashCard, myHands)

  console.log(`com1 - ${com1Hands} - ${canCom1Dobon}`)
  console.log(`com2 - ${com2Hands} - ${canCom2Dobon}`)
  console.log(`com3 - ${com3Hands} - ${canCom3Dobon}`)
  console.log(`me - ${myHands} - ${canIDobon}`)
  console.log(`\n--- DOBON CHECK END ---\n`)

  const dobonPlayers: Pick<Player, 'nickname'| 'turn'>[] = []
  canIDobon && dobonPlayers.push({ nickname: me?.nickname ?? 'あなた', turn: 1 })
  canCom1Dobon && dobonPlayers.push({ nickname: 'com1', turn: 2 })
  canCom2Dobon && dobonPlayers.push({ nickname: 'com2', turn: 3 })
  canCom3Dobon && dobonPlayers.push({ nickname: 'com3', turn: 4 })

  return {
    dobonPlayers,
    com1Hands,
    com2Hands,
    com3Hands,
    myHands,
  }
}

export { checkDobonPlayers }