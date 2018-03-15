const binanceSymbols = require('./binance/symbols')
const bittrexSymbols = require('./bittrex/symbols')
const bittrex = require('./bittrex/bittrex')
const Normalizer = require('../index')

const Match = () => {}

Match.findMatches = () => {
  let matches = []

  for (let i = 0; i < binanceSymbols.length; i++) {
    let binanceSymbol = binanceSymbols[i]

    for (let j = 0; j < bittrexSymbols.length; j++) {
      let bittrexSymbol = bittrexSymbols[j]

      if (binanceSymbol.baseAsset === bittrexSymbol.baseAsset &&
         binanceSymbol.quoteAsset === bittrexSymbol.quoteAsset) {
        matches.push(Normalizer.pair(bittrexSymbol.symbol, bittrex.symbolDelimiter, 'bittrex'))
      }
    }
  }

  return matches
}

module.exports = Match
