const binanceSymbols = require('./binance/symbols')
const bittrexSymbols = require('./bittrex/symbols')
const bittrex = require('./bittrex/bittrex')

const Match = () => {}

Match.findMatches = () => {
  let matches = []

  for (let i = 0; i < binanceSymbols.length; i++) {
    let binanceSymbol = binanceSymbols[i]

    for (let j = 0; j < bittrexSymbols.length; j++) {
      let bittrexSymbol = bittrexSymbols[j]

      if (binanceSymbol.baseAsset === bittrexSymbol.baseAsset &&
         binanceSymbol.quoteAsset === bittrexSymbol.quoteAsset) {
        matches.push(bittrexSymbol.symbol)
      }
    }
  }

  return {
    matches: matches,
    exchangeName: 'bittrex',
    symbolDelimiter: bittrex.symbolDelimiter
  }
}

module.exports = Match
