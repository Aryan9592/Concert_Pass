export const formatBalance = (rawBalance) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000)
    return parseFloat(balance)
  }
  
export const formatChainAsNum = (chainIdHex) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export const formatDetails = (rawBalance) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000)
  return balance
}