type mappedObj = { [key: string]: string }

export default (arr: string[]): mappedObj => {
  const obj: mappedObj = {}
  arr.map((i) => {
    obj[i] = i
  })
  return obj
}
