const R = require('ramda')

const mapping = require('./utils/mapping')
const binance = require('./utils/binance/binance')
const bittrex = require('./utils/bittrex/bittrex')
const binanceSymbols = require('./utils/binance/symbols')
const bittrexSymbols = require('./utils/bittrex/symbols')

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
    quoteAsset = assets[0]
    baseAsset = assets[1]
  }

  if (exchangeName && (baseAsset === undefined || quoteAsset === undefined)) {
    let foundSymbol
    if (exchangeName === 'binance') {
      foundSymbol = R.find(R.propEq('symbol', pair))(binanceSymbols)
    } else if (exchangeName === 'bittrex') {
      foundSymbol = R.find(R.propEq('symbol', pair))(bittrexSymbols)
    } else {
      throw new Error('exchange unavailable')
    }

    if (!foundSymbol) {
      throw new Error(`the pair ${pair} does not exist in the exchange ${exchangeName}`)
    }

    baseAsset = foundSymbol.baseAsset
    quoteAsset = foundSymbol.quoteAsset
  }

  const normalizedBaseAsset = Normalizr.currency(baseAsset)
  const normalizedQuoteAsset = Normalizr.currency(quoteAsset)

  return `${normalizedQuoteAsset}-${normalizedBaseAsset}`
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
  let quoteAsset = pairList[0]
  let baseAsset = pairList[1]
  let exchangeSymbols = []
  let symbolTemplate = ''

  if (exchangeName === 'binance') {
    symbolTemplate = `base${binance.symbolDelimiter}quote`
    exchangeSymbols = R.map((obj) => obj.symbol, binanceSymbols)
  } else if (exchangeName === 'bittrex') {
    symbolTemplate = `quote${bittrex.symbolDelimiter}base`
    exchangeSymbols = R.map((obj) => obj.symbol, bittrexSymbols)
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
      let currentSymbol = symbolTemplate
        .replace('quote', currentQuoteAsset)
        .replace('base', currentBaseAsset)

      if (R.indexOf(currentSymbol, exchangeSymbols) > -1) {
        denormalizedPair = currentSymbol
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
