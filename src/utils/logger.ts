const info = (...params: (string | object)[]): void => {
  console.log(...params)
}

const error = (...params: (string | object)[]): void => {
  console.error(...params)
}

export default { info, error }
