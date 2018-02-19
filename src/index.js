const R = require('ramda')

const mapping = require('./utils/mapping')
const binanceSymbols = require('./utils/binance/symbols')

const Normalizr = () => {
}

Normalizr.pair = (pair, delimiter, exchangeName) => {
  /*
  * pairs can be formatted like:
  *   XBCMIOTA
  *   BTC-IOT
  *   XRP_ETH
  *   LTC/XBC
  *
  * the output will be formatted like:
  *   BTC-IOTA
  *   BTC-IOTA
  *   XRP-ETH
  *   LTC-BTC
  * */

  let baseAsset
  let quoteAsset

  if (!pair) {
    throw new Error('you must inform a pair to be normalized')
  }

  if (delimiter) {
    if (pair.indexOf(delimiter) <= -1) {
      throw new Error (`The pair ${pair} does not contain the delimiter "${delimiter}"`)
    }

    let assets = R.split(delimiter, pair)
    baseAsset = assets[0]
    quoteAsset = assets[1]
  }

  if (exchangeName && (baseAsset === undefined || quoteAsset === undefined)) {
    if (exchangeName === 'binance') {
      const foundSymbol = R.find(R.propEq('symbol', pair))(binanceSymbols)

      baseAsset = foundSymbol.baseAsset
      quoteAsset = foundSymbol.quoteAsset
    } else {
      throw new Error('exchange not available')
    }
  }

  const normalizedBaseAsset = Normalizr.currency(baseAsset)
  const normalizedQuoteAsset = Normalizr.currency(quoteAsset)

  return `${normalizedBaseAsset}-${normalizedQuoteAsset}`
}

Normalizr.currency = (currency) => {
  let standard = currency

  for (let i = 0; i < mapping.currencies.length; i++) {
    let currentCoin = mapping.currencies[i]

    if (R.contains(currency, currentCoin.alternatives)) {
      standard = currentCoin.standard
      break
    }
  }

  return standard
}

module.exports = Normalizr
