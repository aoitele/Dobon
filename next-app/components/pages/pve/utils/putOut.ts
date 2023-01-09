import sleep from "../../../../utils/game/sleep"

const putOut = async(card: string) => {
  await sleep (1000)
  console.log(`${card} - putOut done`)
}

export { putOut }