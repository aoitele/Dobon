const shuffle = (array: any[]) => {
  const res = [...array]
  for (let i = res.length; i > 1; i -= 1) {
    const k = Math.floor(Math.random() * i)
    ;[res[k], res[i - 1]] = [res[i - 1], res[k]]
  }
  return res
}

export { shuffle }
