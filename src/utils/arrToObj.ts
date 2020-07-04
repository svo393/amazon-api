type mappedObj = { [ key: string ]: string }

export default (arr: string[]): mappedObj => {
  let obj: mappedObj = {}
  arr.map((i) => { obj[i] = i })
  return obj
}
