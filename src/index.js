const R = require('ramda')

const mapping = require('./utils/mapping')
const binance = require('./utils/binance/binance')
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

  if (pair && !delimiter && !exchangeName) {
    throw new Error('you should provide at least the delimiter or the exchange name')
  }

  if (delimiter) {
    if (pair.indexOf(delimiter) <= -1) {
      throw new Error(`the pair ${pair} does not contain the delimiter "${delimiter}"`)
    }

    let assets = R.split(delimiter, pair)
    baseAsset = assets[0]
    quoteAsset = assets[1]
  }

  if (exchangeName && (baseAsset === undefined || quoteAsset === undefined)) {
    if (exchangeName === 'binance') {
      const foundSymbol = R.find(R.propEq('symbol', pair))(binanceSymbols)

      if (!foundSymbol) {
        throw new Error(`the pair ${pair} does not exist in the exchange ${exchangeName}`)
      }

      baseAsset = foundSymbol.baseAsset
      quoteAsset = foundSymbol.quoteAsset
    } else {
      throw new Error('exchange unavailable')
    }
  }

  const normalizedBaseAsset = Normalizr.currency(baseAsset)
  const normalizedQuoteAsset = Normalizr.currency(quoteAsset)

  return `${normalizedBaseAsset}-${normalizedQuoteAsset}`
}

Normalizr.currency = (currency) => {
  let standard = currency

  for (let i = 0; i < mapping.currencies.length; i++) {
    let currentCurrency = mapping.currencies[i]

    if (R.contains(currency, currentCurrency.alternatives)) {
      standard = currentCurrency.standard
      break
    }
  }

  return standard
}

Normalizr.denormalize = () => {}

Normalizr.currencyAlternatives = (currency) => {
  /*
   * it resolves with the currency alternatives
  * */
  let alternatives = [currency]

  for (let i = 0; i < mapping.currencies.length; i++) {
    let currentCurrency = mapping.currencies[i]

    if (R.contains(currency, currentCurrency.alternatives)) {
      alternatives = currentCurrency.alternatives
      break
    }
  }

  return alternatives
}

Normalizr.denormalize.pair = (pair, exchangeName) => {
  if (!pair) {
    throw new Error('inform a pair to be denormalized')
  }

  if (!exchangeName) {
    throw new Error('impossible to denormalize without exchange name')
  }

  let pairList = R.split('-', pair)
  let baseAsset = pairList[0]
  let quoteAsset = pairList[1]
  let symbolDelimiter = ''
  let exchangeSymbols = []

  if (exchangeName === 'binance') {
    symbolDelimiter = binance.symbolDelimiter
    exchangeSymbols = R.map((obj) => obj.symbol, binanceSymbols)
  } else {
    throw new Error('exchange unavailable')
  }

  let baseAlternatives = Normalizr.currencyAlternatives(baseAsset)
  let quoteAlternatives = Normalizr.currencyAlternatives(quoteAsset)

  let denormalizedPair
  for (let i = 0; i < baseAlternatives.length; i++) {
    let currentBaseAsset = baseAlternatives[i]

    for (let j = 0; j < quoteAlternatives.length; j++) {
      let currentQuoteAsset = quoteAlternatives[j]

      if (R.indexOf(`${currentBaseAsset}${symbolDelimiter}${currentQuoteAsset}`, exchangeSymbols) > -1) {
        denormalizedPair = `${currentBaseAsset}${symbolDelimiter}${currentQuoteAsset}`
        break
      }
    }

    if (denormalizedPair) {
      break
    }
  }

  return denormalizedPair || pair
}

module.exports = Normalizr
